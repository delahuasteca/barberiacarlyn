import { NextRequest, NextResponse } from "next/server";
import { getOwnerPassword, generateSessionToken, OWNER_SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: "Contraseña requerida" }, { status: 400 });
    }

    const expected = getOwnerPassword();

    if (password !== expected) {
      // Simulate small timing delay against brute force
      await new Promise((r) => setTimeout(r, 400));
      return NextResponse.json({ error: "Credenciales no válidas" }, { status: 401 });
    }

    const token = generateSessionToken();

    const response = NextResponse.json({ success: true, message: "Sesión autorizada" });

    response.cookies.set({
      name: OWNER_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: "Error en autenticación", details: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Sesión cerrada" });
  response.cookies.delete(OWNER_SESSION_COOKIE);
  return response;
}
