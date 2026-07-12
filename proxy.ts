import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;
const locales = ["es", "gl"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorar archivos internos, API, Centro de Gestión
  // y archivos públicos con extensión.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/gestion") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Si la dirección ya contiene idioma, dejarla pasar.
  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) ||
      pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // La web pública utiliza gallego por defecto.
  return NextResponse.redirect(
    new URL(`/gl${pathname}`, request.url)
  );
}