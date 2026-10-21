
import Link from "next/link";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";

type Noticia = {
  id: number;
  titulo_gl: string;
  titulo_es: string;
  resumen_gl: string;
  resumen_es: string;
  contenido_gl: string;
  contenido_es: string;
  slug: string;
  imagen_url: string | null;
  imagen_alt_gl: string | null;
  imagen_alt_es: string | null;
  fecha_publicacion: string | null;
};

function mostrarFecha(fecha: string | null, lang: Locale) {
  if (!fecha) return null;

  return new Intl.DateTimeFormat(
    lang === "gl" ? "gl-ES" : "es-ES",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/Madrid",
    }
  ).format(new Date(fecha));
}

export default async function Novas({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;

  const lang: Locale = isLocale(langParam)
    ? langParam
    : defaultLocale;

  const isGL = lang === "gl";

  const supabase = await createClient();

  const ahora = new Date().toISOString();

  const { data, error } = await supabase
    .from("noticias")
    .select(
      `
        id,
        titulo_gl,
        titulo_es,
        resumen_gl,
        resumen_es,
        contenido_gl,
        contenido_es,
        slug,
        imagen_url,
        imagen_alt_gl,
        imagen_alt_es,
        fecha_publicacion
      `
    )
    .eq("publicada", true)
    .not("fecha_publicacion", "is", null)
    .lte("fecha_publicacion", ahora)
    .order("fecha_publicacion", { ascending: false });

  if (error) {
    console.error("Error al cargar noticias públicas:", error);
  }

  const noticias = (data ?? []) as Noticia[];

  return (
    <>
      <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <header>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-700">
            Asociación Mar de San Ciprián
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            {isGL ? "Novas" : "Noticias"}
          </h1>

          <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">
            {isGL
              ? "Actualidade, comunicacións e novas da Asociación Mar de San Ciprián."
              : "Actualidad, comunicaciones y noticias de la Asociación Mar de San Ciprián."}
          </p>
        </header>

        <section className="mt-10">
          {error ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                {isGL
                  ? "Non foi posible cargar as novas"
                  : "No ha sido posible cargar las noticias"}
              </h2>

              <p className="mt-3 text-slate-600">
                {isGL
                  ? "Téntao de novo máis tarde."
                  : "Inténtalo de nuevo más tarde."}
              </p>
            </div>
          ) : noticias.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                {isGL
                  ? "Próximas publicacións"
                  : "Próximas publicaciones"}
              </h2>

              <p className="mt-3 leading-relaxed text-slate-600">
                {isGL
                  ? "Estamos preparando as primeiras novas da asociación. Neste espazo compartiremos actividades, novidades e comunicacións de interese."
                  : "Estamos preparando las primeras noticias de la asociación. En este espacio compartiremos actividades, novedades y comunicaciones de interés."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {noticias.map((noticia) => {
                const titulo = isGL
                  ? noticia.titulo_gl
                  : noticia.titulo_es;

                const resumen = isGL
                  ? noticia.resumen_gl
                  : noticia.resumen_es;

                const contenido = isGL
                  ? noticia.contenido_gl
                  : noticia.contenido_es;

                const textoAlternativo = isGL
                  ? noticia.imagen_alt_gl
                  : noticia.imagen_alt_es;

                return (
                  <article
                    key={noticia.id}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                  >
                    {noticia.imagen_url && (
                      <div className="aspect-video overflow-hidden bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={noticia.imagen_url}
                          alt={textoAlternativo || titulo}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    <div className="p-6">
                      {noticia.fecha_publicacion && (
                        <p className="text-sm font-semibold text-sky-700">
                          {mostrarFecha(
                            noticia.fecha_publicacion,
                            lang
                          )}
                        </p>
                      )}

                      <h2 className="mt-3 text-2xl font-bold text-slate-900">
                        {titulo}
                      </h2>

                      <p className="mt-4 leading-relaxed text-slate-600">
                        {resumen}
                      </p>

                      <details className="mt-5 border-t border-slate-100 pt-4">
                        <summary className="cursor-pointer font-semibold text-sky-800 hover:text-sky-600">
                          {isGL
                            ? "Ler noticia completa"
                            : "Leer noticia completa"}
                        </summary>

                        <div className="mt-4 whitespace-pre-line leading-7 text-slate-700">
                          {contenido}
                        </div>
                      </details>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-12 rounded-3xl bg-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900">
            {isGL
              ? "Mantente informado"
              : "Mantente informado"}
          </h2>

          <p className="mt-3 text-slate-600">
            {isGL
              ? "Consulta tamén as actividades e eventos organizados pola asociación."
              : "Consulta también las actividades y eventos organizados por la asociación."}
          </p>

          <Link
            href={`/${lang}/actividades`}
            className="mt-4 inline-block font-semibold text-sky-800 hover:underline"
          >
            {isGL
              ? "Ver actividades"
              : "Ver actividades"}{" "}
            →
          </Link>
        </section>
      </main>

      <Footer lang={lang} />
    </>
  );
}
