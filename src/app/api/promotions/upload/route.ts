import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { put } from "@vercel/blob";
import { isOwnerAuthenticated } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { isSafeUrl } from "@/lib/promotions";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

const ALLOWED_MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * Verifies real image magic bytes (JPEG, PNG, WebP) so renamed non-image files are rejected.
 */
function detectRealImageMime(buf: Buffer): "image/jpeg" | "image/png" | "image/webp" | null {
  if (buf.length < 12) return null;

  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return "image/jpeg";
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return "image/png";
  }

  // WebP: "RIFF" .... "WEBP"
  if (
    buf.subarray(0, 4).toString("ascii") === "RIFF" &&
    buf.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
}

export async function POST(request: NextRequest) {
  if (!isOwnerAuthenticated(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Archivo de imagen requerido (campo 'file')." },
        { status: 400 }
      );
    }

    if (file.size <= 0) {
      return NextResponse.json({ error: "El archivo está vacío." }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "La imagen excede el tamaño máximo permitido de 2 MB." },
        { status: 400 }
      );
    }

    const declaredMime = (file.type || "").toLowerCase();
    if (!ALLOWED_MIME_TO_EXT[declaredMime]) {
      return NextResponse.json(
        { error: "Formato no permitido. Usa únicamente JPG, PNG o WebP." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const detectedMime = detectRealImageMime(buffer);

    if (!detectedMime || !ALLOWED_MIME_TO_EXT[detectedMime]) {
      return NextResponse.json(
        { error: "El contenido del archivo no corresponde a una imagen JPG, PNG o WebP válida." },
        { status: 400 }
      );
    }

    const ext = ALLOWED_MIME_TO_EXT[detectedMime];
    const objectName = `promo-${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;

    // Priority 1: Vercel Blob (supports both OIDC + BLOB_STORE_ID and legacy BLOB_READ_WRITE_TOKEN)
    const blobToken = (process.env.BLOB_READ_WRITE_TOKEN || "").trim();
    const blobStoreId = (process.env.BLOB_STORE_ID || "").trim();
    if (blobToken || blobStoreId) {
      try {
        const blob = await put(
          `promotions/${objectName}`,
          buffer,
          blobToken
            ? { access: "public", contentType: detectedMime, token: blobToken }
            : { access: "public", contentType: detectedMime }
        );

        if (!isSafeUrl(blob.url, { allowRelative: false })) {
          return NextResponse.json(
            { error: "URL de almacenamiento inválida." },
            { status: 500 }
          );
        }

        return NextResponse.json(
          {
            ok: true,
            url: blob.url,
            provider: "vercel_blob",
            authMode: blobToken ? "token" : "oidc",
            contentType: detectedMime,
            size: file.size,
          },
          { status: 201 }
        );
      } catch (blobErr) {
        const safeMsg = String((blobErr as Error)?.message || "Error al subir a Vercel Blob")
          .replace(/https?:\/\/\S+/gi, "[url]")
          .slice(0, 200);
        console.error("[promotions/upload] Vercel Blob error:", safeMsg);
        return NextResponse.json(
          { error: `Error Vercel Blob: ${safeMsg}` },
          { status: 502 }
        );
      }
    }

    // Priority 2: Supabase Storage (free bucket 'Promotions', zero extra env vars in Preview)
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const bucket = (process.env.PROMOTIONS_STORAGE_BUCKET || "Promotions").trim();
      const uploadBody = new Uint8Array(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(objectName, uploadBody, {
          contentType: detectedMime,
          upsert: false,
          cacheControl: "3600",
        });

      if (uploadError) {
        const errWithStatus = uploadError as { statusCode?: string | number; status?: number; message?: string };
        const rawStatus = errWithStatus.statusCode ?? errWithStatus.status ?? "unknown";
        const safeMessage = String(errWithStatus.message || "Error desconocido de Storage")
          .replace(/https?:\/\/\S+/gi, "[url]")
          .slice(0, 200);

        console.error("[promotions/upload] Supabase Storage error:", {
          bucket,
          status: rawStatus,
          message: safeMessage,
        });

        return NextResponse.json(
          {
            error: `Error Supabase Storage (status ${rawStatus}): ${safeMessage}`,
            supabaseStatus: rawStatus,
          },
          { status: 502 }
        );
      }

      const { data: pubData } = supabase.storage.from(bucket).getPublicUrl(objectName);
      const publicUrl = pubData?.publicUrl || "";

      if (!isSafeUrl(publicUrl, { allowRelative: false })) {
        return NextResponse.json(
          { error: "URL pública generada inválida." },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { ok: true, url: publicUrl, provider: "supabase_storage", contentType: detectedMime, size: file.size },
        { status: 201 }
      );
    }

    // Neither storage provider is configured yet
    return NextResponse.json(
      {
        error:
          "Almacenamiento de imágenes aún no activado. Configura Vercel Blob (BLOB_READ_WRITE_TOKEN) o el bucket público 'Promotions' en Supabase Storage, o pega una URL HTTPS manualmente.",
      },
      { status: 503 }
    );
  } catch {
    return NextResponse.json(
      { error: "Error interno al procesar la imagen." },
      { status: 500 }
    );
  }
}
