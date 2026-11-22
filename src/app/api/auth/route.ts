import { NextRequest, NextResponse } from "next/server";
import {
  isAuthConfigured,
  verifyOwnerPassword,
  generateSessionToken,
  OWNER_SESSION_COOKIE,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    if (!isAuthConfigured()) {
      return NextResponse.json(
        { error: "Autenticación no configurada en el servidor" },
        { status: 503 }
      );
    }

    const { password } = await request.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Contraseña requerida" }, { status: 400 });
    }

    if (!verifyOwnerPassword(password)) {
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
  } catch {
    return NextResponse.json(
      { error: "Error en autenticación" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Sesión cerrada" });
  response.cookies.delete(OWNER_SESSION_COOKIE);
  return response;
}
