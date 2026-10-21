import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LayoutGestion from "@/components/gestion/LayoutGestion";
import SubidaGaleria from "@/components/gestion/SubidaGaleria";

type Album = {
  id: number;
  titulo_gl: string;
  titulo_es: string;
  descripcion_gl: string | null;
  descripcion_es: string | null;
  slug: string;
  portada_url: string | null;
  fecha_evento: string | null;
  publicado: boolean;
  destacado: boolean;
  created_at: string;
};

type ElementoGaleria = {
  id: number;
  album_id: number | null;
  tipo: "imagen" | "video";
  archivo_url: string;
  nombre_archivo: string;
  titulo_gl: string | null;
  titulo_es: string | null;
  publicado: boolean;
  autor_fotografia: string | null;
  fecha_captura: string | null;
  created_at: string;
};

function mostrarFecha(fecha: string | null) {
  if (!fecha) {
    return null;
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${fecha}T12:00:00`));
}

export default async function GaleriaGestionPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/gestion");
  }

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
        publicado,
        destacado,
        created_at
      `
    )
    .order("fecha_evento", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (albumesError) {
    console.error("Error al consultar los álbumes:", albumesError);
  }

  const { data: elementosData, error: elementosError } = await supabase
    .from("galeria_elementos")
    .select(
      `
        id,
        album_id,
        tipo,
        archivo_url,
        nombre_archivo,
        titulo_gl,
        titulo_es,
        publicado,
        autor_fotografia,
        fecha_captura,
        created_at
      `
    )
    .order("created_at", { ascending: false });

  if (elementosError) {
    console.error("Error al consultar la galería:", elementosError);
  }

  const albumes = (albumesData ?? []) as Album[];
  const archivos = (elementosData ?? []) as ElementoGaleria[];

  const total = archivos.length;

  const fotografias = archivos.filter(
    (elemento) => elemento.tipo === "imagen"
  ).length;

  const videos = archivos.filter(
    (elemento) => elemento.tipo === "video"
  ).length;

  const albumesParaSubida = albumes.map((album) => ({
    id: album.id,
    titulo_gl: album.titulo_gl,
    titulo_es: album.titulo_es,
  }));

  return (
    <LayoutGestion
      seccionActiva="galeria"
      titulo="Galería"
      descripcion="Sube, organiza y publica fotografías y vídeos de la Asociación Mar de San Ciprián."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Álbumes
          </p>

          <p className="mt-2 text-4xl font-bold text-slate-900">
            {albumes.length}
          </p>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Total de archivos
          </p>

          <p className="mt-2 text-4xl font-bold text-slate-900">
            {total}
          </p>
        </article>

        <article className="rounded-3xl border border-sky-200 bg-sky-50 p-6 shadow-sm">
          <p className="text-sm font-semibold text-sky-700">
            Fotografías
          </p>

          <p className="mt-2 text-4xl font-bold text-sky-900">
            {fotografias}
          </p>
        </article>

        <article className="rounded-3xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm">
          <p className="text-sm font-semibold text-indigo-700">
            Vídeos
          </p>

          <p className="mt-2 text-4xl font-bold text-indigo-900">
            {videos}
          </p>
        </article>
      </section>

      <section className="mt-8">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Álbumes
            </h2>

            <p className="mt-2 text-slate-600">
              Organiza fotografías y vídeos por eventos, actividades o temas.
            </p>
          </div>

          <Link
            href="/gestion/galeria/nuevo-album"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-sky-800"
          >
            + Nuevo álbum
          </Link>
        </div>

        {albumes.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">
              Todavía no hay álbumes
            </h3>

            <p className="mt-2 text-slate-600">
              Crea el primer álbum para empezar a organizar la biblioteca multimedia.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {albumes.map((album) => {
              const elementosAlbum = archivos.filter(
                (elemento) => elemento.album_id === album.id
              );

              const imagenPortada =
                album.portada_url ||
                elementosAlbum.find(
                  (elemento) => elemento.tipo === "imagen"
                )?.archivo_url ||
                null;

              return (
                <Link
                  key={album.id}
                  href={`/gestion/galeria/${album.id}`}
                  className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg"
                >
                  <article>
                    <div className="aspect-video bg-slate-100">
                      {imagenPortada ? (
                        <img
                          src={imagenPortada}
                          alt={album.titulo_gl}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-6 text-center text-sm font-semibold text-slate-400">
                          Álbum sin portada
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="text-xl font-bold text-slate-900 transition group-hover:text-sky-800">
                            {album.titulo_gl}
                          </h3>

                          {album.titulo_es !== album.titulo_gl && (
                            <p className="mt-1 text-sm text-slate-500">
                              {album.titulo_es}
                            </p>
                          )}
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                            album.publicado
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {album.publicado ? "Publicado" : "Borrador"}
                        </span>
                      </div>

                      {album.descripcion_gl && (
                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                          {album.descripcion_gl}
                        </p>
                      )}

                      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                        <span>
                          <strong>{elementosAlbum.length}</strong>{" "}
                          {elementosAlbum.length === 1
                            ? "archivo"
                            : "archivos"}
                        </span>

                        {album.fecha_evento && (
                          <span>{mostrarFecha(album.fecha_evento)}</span>
                        )}

                        {album.destacado && (
                          <span className="font-semibold text-sky-700">
                            Destacado
                          </span>
                        )}
                      </div>

                      <p className="mt-5 text-sm font-semibold text-sky-700">
                        Abrir álbum →
                      </p>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-900">
            Añadir archivo
          </h2>

          <p className="mt-2 text-slate-600">
            Sube una fotografía o un vídeo a la biblioteca multimedia.
          </p>
        </div>

        <SubidaGaleria albumes={albumesParaSubida} />
      </section>

      <section className="mt-10">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-900">
            Biblioteca multimedia
          </h2>

          <p className="mt-2 text-slate-600">
            Archivos almacenados actualmente en la galería.
          </p>
        </div>

        {archivos.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-900">
              Todavía no hay archivos en la galería
            </p>

            <p className="mt-2 text-slate-600">
              La primera fotografía o vídeo que subas aparecerá aquí.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {archivos.map((elemento) => (
              <article
                key={elemento.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="aspect-video bg-slate-900">
                  {elemento.tipo === "imagen" ? (
                    <img
                      src={elemento.archivo_url}
                      alt={
                        elemento.titulo_gl ||
                        elemento.titulo_es ||
                        elemento.nombre_archivo
                      }
                      className="h-full w-full object-cover"
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
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
                        {elemento.tipo === "imagen"
                          ? "Fotografía"
                          : "Vídeo"}
                      </p>

                      <h3 className="mt-1 break-words text-lg font-bold text-slate-900">
                        {elemento.titulo_gl ||
                          elemento.titulo_es ||
                          elemento.nombre_archivo}
                      </h3>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        elemento.publicado
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {elemento.publicado
                        ? "Publicado"
                        : "Borrador"}
                    </span>
                  </div>

                  {elemento.autor_fotografia && (
                    <p className="mt-4 text-sm text-slate-600">
                      <span className="font-semibold">Autor:</span>{" "}
                      {elemento.autor_fotografia}
                    </p>
                  )}

                  {elemento.fecha_captura && (
                    <p className="mt-2 text-sm text-slate-600">
                      <span className="font-semibold">Fecha:</span>{" "}
                      {mostrarFecha(elemento.fecha_captura)}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </LayoutGestion>
  );
}