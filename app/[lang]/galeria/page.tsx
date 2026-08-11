import Link from "next/link";
import Footer from "@/components/Footer";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { createClient } from "@/lib/supabase/server";

type Album = {
  id: number;
  titulo_gl: string;
  titulo_es: string;
  descripcion_gl: string | null;
  descripcion_es: string | null;
  slug: string;
  portada_url: string | null;
  fecha_evento: string | null;
  destacado: boolean;
};

type Elemento = {
  id: number;
  album_id: number | null;
  tipo: "imagen" | "video";
  archivo_url: string;
  titulo_gl: string | null;
  titulo_es: string | null;
  alt_gl: string | null;
  alt_es: string | null;
};

function mostrarFecha(fecha: string | null, lang: Locale) {
  if (!fecha) {
    return null;
  }

  return new Intl.DateTimeFormat(
    lang === "gl" ? "gl-ES" : "es-ES",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  ).format(new Date(`${fecha}T12:00:00`));
}

export default async function Galeria({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;

  const lang: Locale = isLocale(langParam)
    ? langParam
    : defaultLocale;

  await getDictionary(lang);

  const isGL = lang === "gl";

  const supabase = await createClient();

  const { data: albumesData, error: albumesError } = await supabase
    .from("galeria_albumes")
    .select(
      `
        id,
        titulo_gl,
        titulo_es,
        descripcion_gl,
        descripcion_es,
        slug,
        portada_url,
        fecha_evento,
        destacado
      `
    )
    .eq("publicado", true)
    .order("destacado", { ascending: false })
    .order("fecha_evento", {
      ascending: false,
      nullsFirst: false,
    });

  if (albumesError) {
    console.error(
      "Error al consultar los álbumes públicos:",
      albumesError
    );
  }

  const { data: elementosData, error: elementosError } = await supabase
    .from("galeria_elementos")
    .select(
      `
        id,
        album_id,
        tipo,
        archivo_url,
        titulo_gl,
        titulo_es,
        alt_gl,
        alt_es
      `
    )
    .eq("publicado", true)
    .order("orden", { ascending: true });

  if (elementosError) {
    console.error(
      "Error al consultar los archivos públicos:",
      elementosError
    );
  }

  const albumes = (albumesData ?? []) as Album[];
  const elementos = (elementosData ?? []) as Elemento[];

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <header className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-700">
            {isGL ? "Arquivo multimedia" : "Archivo multimedia"}
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">
            Galería
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            {isGL
              ? "Fotografías e vídeos do mar, das actividades e da vida da Asociación Mar de San Ciprián."
              : "Fotografías y vídeos del mar, de las actividades y de la vida de la Asociación Mar de San Ciprián."}
          </p>
        </header>

        {albumes.length === 0 ? (
          <section className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              {isGL
                ? "Aínda non hai álbums publicados"
                : "Todavía no hay álbumes publicados"}
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              {isGL
                ? "Estamos preparando o arquivo fotográfico e audiovisual da asociación."
                : "Estamos preparando el archivo fotográfico y audiovisual de la asociación."}
            </p>
          </section>
        ) : (
          <section className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {albumes.map((album) => {
              const elementosAlbum = elementos.filter(
                (elemento) => elemento.album_id === album.id
              );

              const portada =
                album.portada_url ||
                elementosAlbum.find(
                  (elemento) => elemento.tipo === "imagen"
                )?.archivo_url ||
                null;

              const titulo = isGL
                ? album.titulo_gl
                : album.titulo_es;

              const descripcion = isGL
                ? album.descripcion_gl
                : album.descripcion_es;

              const fecha = mostrarFecha(album.fecha_evento, lang);

              return (
                <Link
                  key={album.id}
                  href={`/${lang}/galeria/${album.slug}`}
                  className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg"
                >
                  <article>
                    <div className="aspect-[4/3] bg-slate-100">
                      {portada ? (
                        <img
                          src={portada}
                          alt={titulo}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-8 text-center font-semibold text-slate-400">
                          {isGL
                            ? "Álbum sen portada"
                            : "Álbum sin portada"}
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="text-2xl font-bold text-slate-900 transition group-hover:text-sky-800">
                          {titulo}
                        </h2>

                        {album.destacado && (
                          <span className="shrink-0 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">
                            Destacado
                          </span>
                        )}
                      </div>

                      {fecha && (
                        <p className="mt-3 text-sm font-semibold text-slate-500">
                          {fecha}
                        </p>
                      )}

                      {descripcion && (
                        <p className="mt-4 line-clamp-4 leading-7 text-slate-600">
                          {descripcion}
                        </p>
                      )}

                      <div className="mt-6 border-t border-slate-100 pt-4">
                        <p className="text-sm font-semibold text-sky-700">
                          {elementosAlbum.length}{" "}
                          {elementosAlbum.length === 1
                            ? isGL
                              ? "arquivo publicado"
                              : "archivo publicado"
                            : isGL
                              ? "arquivos publicados"
                              : "archivos publicados"}
                        </p>

                        <p className="mt-3 text-sm font-semibold text-sky-700">
                          {isGL
                            ? "Abrir álbum →"
                            : "Abrir álbum →"}
                        </p>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </section>
        )}
      </main>

      <Footer lang={lang} />
    </>
  );
}