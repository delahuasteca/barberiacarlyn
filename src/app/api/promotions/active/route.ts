import { NextRequest, NextResponse } from "next/server";
import { getActivePromotionForPath, normalizePathname } from "@/lib/promotions";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawPath = searchParams.get("path") || "/";
    const path = normalizePathname(rawPath);

    const promotion = await getActivePromotionForPath(path);

    return NextResponse.json(
      { ok: true, path, promotion },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Error al consultar promociones activas" },
      { status: 500 }
    );
  }
}
