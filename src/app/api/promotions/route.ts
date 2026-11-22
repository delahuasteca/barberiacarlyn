import { NextRequest, NextResponse } from "next/server";
import { isOwnerAuthenticated } from "@/lib/auth";
import {
  listPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  validatePromotionCreate,
  getPromotionsStorageMode,
} from "@/lib/promotions";

function unauthorized() {
  return NextResponse.json({ error: "No autorizado" }, { status: 401 });
}

export async function GET(request: NextRequest) {
  if (!isOwnerAuthenticated(request)) return unauthorized();

  try {
    const promotions = await listPromotions();
    return NextResponse.json({
      ok: true,
      promotions,
      storageMode: getPromotionsStorageMode(),
    });
  } catch {
    return NextResponse.json({ error: "Error al listar promociones" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isOwnerAuthenticated(request)) return unauthorized();

  try {
    const body = await request.json();
    const validation = validatePromotionCreate(body);
    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        { error: "Datos de promoción inválidos", details: validation.errors },
        { status: 400 }
      );
    }

    const promotion = await createPromotion(validation.data);
    return NextResponse.json({ ok: true, promotion }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al crear promoción" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!isOwnerAuthenticated(request)) return unauthorized();

  try {
    const body = await request.json();
    const id = typeof body?.id === "string" ? body.id.trim() : "";
    if (!id) {
      return NextResponse.json({ error: "ID de promoción requerido" }, { status: 400 });
    }

    const result = await updatePromotion(id, body);
    if (result.notFound) {
      return NextResponse.json({ error: "Promoción no encontrada" }, { status: 404 });
    }
    if (result.errors && result.errors.length > 0) {
      return NextResponse.json(
        { error: "Datos de actualización inválidos", details: result.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, promotion: result.promotion });
  } catch {
    return NextResponse.json({ error: "Error al actualizar promoción" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isOwnerAuthenticated(request)) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    let id = (searchParams.get("id") || "").trim();
    if (!id) {
      try {
        const body = await request.json();
        id = typeof body?.id === "string" ? body.id.trim() : "";
      } catch {
        // no json body
      }
    }

    if (!id) {
      return NextResponse.json({ error: "ID de promoción requerido" }, { status: 400 });
    }

    const deleted = await deletePromotion(id);
    if (!deleted) {
      return NextResponse.json({ error: "Promoción no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, deletedId: id });
  } catch {
    return NextResponse.json({ error: "Error al eliminar promoción" }, { status: 500 });
  }
}
