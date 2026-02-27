import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_FILE = /\.(.*)$/
const locales = ["es", "gl"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignorar archivos estáticos y rutas internas de Next
  if (
    pathname.startsWith("/_next") ||
    pathname.includes("/api/") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return
  }

  // Si ya tiene idioma en la URL → dejar pasar
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Si entra sin idioma → redirigir a español por defecto
  return NextResponse.redirect(new URL(`/es${pathname}`, request.url))
}
