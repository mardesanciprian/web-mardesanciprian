import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import VisorImagen from "@/components/galeria/VisorImagen";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

type AlbumPageProps = {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
};

type Album = {
  id: number;
  titulo_gl: string;
  titulo_es: string;
  descripcion_gl: string | null;
  descripcion_es: string | null;
  slug: string;
  fecha_evento: string | null;
};

type Elemento = {
  id: number;
  tipo: "imagen" | "video";
  archivo_url: string;
  nombre_archivo: string;
  titulo_gl: string | null;
  titulo_es: string | null;
  descripcion_gl: string | null;
  descripcion_es: string | null;
  alt_gl: string | null;
  alt_es: string | null;
  autor_fotografia: string | null;
  fecha_captura: string | null;
  destacado: boolean;
};

function mostrarFecha(fecha: string | null, lang: Locale) {
  if (!fecha) {
    return null;
  }

  const fechaNormalizada = fecha.includes("T")
    ? fecha
    : `${fecha}T12:00:00`;

  return new Intl.DateTimeFormat(
    lang === "gl" ? "gl-ES" : "es-ES",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  ).format(new Date(fechaNormalizada));
}

export default async function AlbumPublicoPage({
  params,
}: AlbumPageProps) {
  const { lang: langParam, slug } = await params;

  const lang: Locale = isLocale(langParam)
    ? langParam
    : defaultLocale;

  const isGL = lang === "gl";

  const supabase = await createClient();

  const { data: albumData, error: albumError } = await supabase
    .from("galeria_albumes")
    .select(
      `
        id,
        titulo_gl,
        titulo_es,
        descripcion_gl,
        descripcion_es,
        slug,
        fecha_evento
      `
    )
    .eq("slug", slug)
    .eq("publicado", true)
    .maybeSingle();

  if (albumError) {
    console.error(
      "Error al consultar el álbum público:",
      albumError
    );
  }

  if (!albumData) {
    notFound();
  }

  const album = albumData as Album;

  const { data: elementosData, error: elementosError } = await supabase
    .from("galeria_elementos")
    .select(
      `
        id,
        tipo,
        archivo_url,
        nombre_archivo,
        titulo_gl,
        titulo_es,
        descripcion_gl,
        descripcion_es,
        alt_gl,
        alt_es,
        autor_fotografia,
        fecha_captura,
        destacado
      `
    )
    .eq("album_id", album.id)
    .eq("publicado", true)
    .order("destacado", { ascending: false })
    .order("orden", { ascending: true })
    .order("created_at", { ascending: false });

  if (elementosError) {
    console.error(
      "Error al consultar los archivos públicos del álbum:",
      elementosError
    );
  }

  const elementos = (elementosData ?? []) as Elemento[];

  const titulo = isGL
    ? album.titulo_gl
    : album.titulo_es;

  const descripcion = isGL
    ? album.descripcion_gl
    : album.descripcion_es;

  const fechaEvento = mostrarFecha(
    album.fecha_evento,
    lang
  );

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-8">
          <Link
            href={`/${lang}/galeria`}
            className="text-sm font-semibold text-sky-700 hover:underline"
          >
            {isGL
              ? "← Volver á galería"
              : "← Volver a la galería"}
          </Link>
        </div>

        <header className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-700">
            Álbum multimedia
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">
            {titulo}
          </h1>

          {fechaEvento && (
            <p className="mt-4 text-sm font-semibold text-slate-500">
              {fechaEvento}
            </p>
          )}

          {descripcion && (
            <p className="mt-6 max-w-3xl whitespace-pre-wrap text-lg leading-8 text-slate-600">
              {descripcion}
            </p>
          )}
        </header>

        {elementos.length === 0 ? (
          <section className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              {isGL
                ? "Este álbum aínda non ten contido publicado"
                : "Este álbum todavía no tiene contenido publicado"}
            </h2>
          </section>
        ) : (
          <section className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {elementos.map((elemento) => {
              const tituloElemento = isGL
                ? elemento.titulo_gl
                : elemento.titulo_es;

              const descripcionElemento = isGL
                ? elemento.descripcion_gl
                : elemento.descripcion_es;

              const altElemento =
                (isGL
                  ? elemento.alt_gl
                  : elemento.alt_es) ||
                tituloElemento ||
                elemento.nombre_archivo;

              const fechaCaptura = mostrarFecha(
                elemento.fecha_captura,
                lang
              );

              return (
                <article
                  key={elemento.id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="aspect-[4/3] bg-slate-900">
                    {elemento.tipo === "imagen" ? (
                      <VisorImagen
                        src={elemento.archivo_url}
                        alt={altElemento}
                        titulo={tituloElemento}
                      />
                    ) : (
                      <video
                        src={elemento.archivo_url}
                        controls
                        preload="metadata"
                        className="h-full w-full object-contain"
                      />
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wide text-sky-700">
                          {elemento.tipo === "imagen"
                            ? "Fotografía"
                            : "Vídeo"}
                        </p>

                        {tituloElemento && (
                          <h2 className="mt-1 text-xl font-bold text-slate-900">
                            {tituloElemento}
                          </h2>
                        )}
                      </div>

                      {elemento.destacado && (
                        <span className="shrink-0 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">
                          Destacado
                        </span>
                      )}
                    </div>

                    {descripcionElemento && (
                      <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-600">
                        {descripcionElemento}
                      </p>
                    )}

                    {elemento.autor_fotografia && (
                      <p className="mt-4 text-sm text-slate-600">
                        <span className="font-semibold">
                          Autor:
                        </span>{" "}
                        {elemento.autor_fotografia}
                      </p>
                    )}

                    {fechaCaptura && (
                      <p className="mt-2 text-sm text-slate-600">
                        <span className="font-semibold">
                          {isGL ? "Data:" : "Fecha:"}
                        </span>{" "}
                        {fechaCaptura}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>

      <Footer lang={lang} />
    </>
  );
}