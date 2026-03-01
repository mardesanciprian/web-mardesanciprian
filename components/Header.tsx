"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

type Lang = "es" | "gl";

type Props = {
  lang: Lang;
};

export default function Header({ lang }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const t = useMemo(() => {
    return lang === "gl"
      ? {
          association: "Asociación",
          activities: "Actividades",
          news: "Novas",
          gallery: "Galería",
          contact: "Contacto",
          join: "Faite socio/a",
          menu: "Menú",
          close: "Pechar",
        }
      : {
          association: "Asociación",
          activities: "Actividades",
          news: "Noticias",
          gallery: "Galería",
          contact: "Contacto",
          join: "Hazte socio",
          menu: "Menú",
          close: "Cerrar",
        };
  }, [lang]);

 
 const navItems = useMemo(
  () => [
    { href: `/${lang}`, label: "🏠 Inicio" },
    { href: `/${lang}/asociacion`, label: t.association },
    { href: `/${lang}/actividades`, label: t.activities },
{ href: lang === "gl" ? `/${lang}/novas` : `/${lang}/noticias`, label: t.news },

    { href: `/${lang}/galeria`, label: t.gallery },
    { href: `/${lang}/contacto`, label: t.contact },
 { href: `/${lang}/merchandising`, label: lang === "gl" ? "Merchandising" : "Merchandising" },
  ],
  [lang, t]
);


  // Cambia idioma manteniendo la misma ruta (si estás en /es/... pasa a /gl/... y viceversa)
  const otherLang: Lang = lang === "es" ? "gl" : "es";
  const switchToOtherLangHref = useMemo(() => {
    if (!pathname) return `/${otherLang}`;
    // si la ruta empieza por /es o /gl, sustituimos el primer segmento
    const parts = pathname.split("/");
    // ["", "es", "algo", ...]
    if (parts.length > 1 && (parts[1] === "es" || parts[1] === "gl")) {
      parts[1] = otherLang;
      return parts.join("/") || `/${otherLang}`;
    }
    // si por lo que sea no viene con idioma
    return `/${otherLang}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
  }, [pathname, otherLang]);

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
      {/* Logo + nombre */}
<Link href={`/${lang}`} className="flex items-center gap-3 min-w-0">
  <img
    src="/images/logo-mardesanciprian.png"
    alt="Logo Asociación Mar de San Ciprián"
    className="h-26 w-auto shrink-0"
  />

  <span className="hidden sm:block font-semibold text-lg leading-tight">
    Asociación Mar de San Ciprián
  </span>
</Link>


        {/* Menú desktop */}
        <nav className="hidden md:flex items-center gap-6 font-medium whitespace-nowrap">
          {navItems.map((it) => (
            <Link key={it.href} href={it.href} className="hover:opacity-80">
              {it.label}
            </Link>
          ))}

          <Link
            href={`/${lang}/hazte-socio`}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:opacity-90"
          >
            {t.join}
          </Link>

          {/* Selector idioma (desktop) */}
  <div className="flex items-center gap-2 ml-2">
  <Link
    href="/es"
    className={`px-2 py-1 rounded-md text-sm border ${
      lang === "es" ? "bg-black text-white border-black" : "bg-white"
    }`}
    aria-label="Cambiar a Español"
  >
    ES
  </Link>

  <Link
    href="/gl"
    className={`px-2 py-1 rounded-md text-sm border ${
      lang === "gl" ? "bg-black text-white border-black" : "bg-white"
    }`}
    aria-label="Cambiar a Galego"
  >
    GL
  </Link>
</div>

        </nav>

        {/* Botones móvil (idioma + hamburguesa) */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            href={switchToOtherLangHref}
            className="px-2 py-1 rounded-md text-sm border"
            aria-label={lang === "es" ? "Cambiar a Galego" : "Cambiar a Español"}
          >
            {otherLang.toUpperCase()}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="px-3 py-2 rounded-md border"
            aria-label={open ? t.close : t.menu}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3">
            {navItems.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className="py-2"
                onClick={() => setOpen(false)}
              >
                {it.label}
              </Link>
            ))}

            <Link
              href={`/${lang}/hazte-socio`}
              className="py-2 px-4 rounded-lg bg-blue-600 text-white text-center"
              onClick={() => setOpen(false)}
            >
              {t.join}
            </Link>

            <div className="flex gap-2 pt-2">
              <Link
                href="/es"
                className={`flex-1 px-3 py-2 rounded-md text-sm border text-center ${
                  lang === "es" ? "bg-black text-white border-black" : ""
                }`}
                onClick={() => setOpen(false)}
              >
                ES
              </Link>
              <Link
                href="/gl"
                className={`flex-1 px-3 py-2 rounded-md text-sm border text-center ${
                  lang === "gl" ? "bg-black text-white border-black" : ""
                }`}
                onClick={() => setOpen(false)}
              >
                GL
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
