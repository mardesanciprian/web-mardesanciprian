import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["es", "gl"] as const;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Dejar pasar Next internals y archivos
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Si es la raíz, manda a /es
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/es", req.url));
  }

  // Primer segmento
  const first = pathname.split("/")[1];

  // Si ya viene con /es o /gl, OK
  if (LOCALES.includes(first as any)) {
    return NextResponse.next();
  }

  // Si viene sin idioma, lo metemos por defecto en /es
  return NextResponse.redirect(new URL(`/es${pathname}`, req.url));
}

export const config = {
  matcher: ["/((?!_next|api).*)"],
};
