import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LayoutGestion from "@/components/gestion/LayoutGestion";

type AlbumPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    ok?: string;
    archivo?: string;
  }>;
};

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
  updated_at: string;
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
  publicado: boolean;
  destacado: boolean;
  orden: number;
  created_at: string;
};

function mostrarFecha(fecha: string | null) {
  if (!fecha) {
    return "Sin fecha";
  }

  const fechaNormalizada = fecha.includes("T")
    ? fecha
    : `${fecha}T12:00:00`;

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(fechaNormalizada));
}

export default async function AlbumGaleriaPage({
  params,
  searchParams,
}: AlbumPageProps) {
  const { id } = await params;
  const { ok, archivo } = await searchParams;

  const albumId = Number(id);

  if (!Number.isInteger(albumId) || albumId <= 0) {
    notFound();
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/gestion");
  }

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
        portada_url,
        fecha_evento,
        publicado,
        destacado,
        created_at,
        updated_at
      `
    )
    .eq("id", albumId)
    .maybeSingle();

  if (albumError) {
    console.error("Error al consultar el álbum:", albumError);
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
        publicado,
        destacado,
        orden,
        created_at
      `
    )
    .eq("album_id", albumId)
    .order("orden", { ascending: true })
    .order("created_at", { ascending: false });

  if (elementosError) {
    console.error(
      "Error al consultar los archivos del álbum:",
      elementosError
    );
  }

  const elementos = (elementosData ?? []) as Elemento[];

  const fotografias = elementos.filter(
    (elemento) => elemento.tipo === "imagen"
  ).length;

  const videos = elementos.filter(
    (elemento) => elemento.tipo === "video"
  ).length;

  const portada =
    album.portada_url ||
    elementos.find(
      (elemento) => elemento.tipo === "imagen"
    )?.archivo_url ||
    null;

  return (
    <LayoutGestion
      seccionActiva="galeria"
      titulo={album.titulo_gl}
      descripcion="Ficha interna del álbum multimedia."
    >
      {ok === "1" && (
        <div
          role="status"
          className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-800"
        >
          Los cambios del álbum se han guardado correctamente.
        </div>
      )}

      {archivo === "editado" && (
        <div
          role="status"
          className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-800"
        >
          Los cambios del archivo se han guardado correctamente.
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/gestion/galeria"
          className="text-sm font-semibold text-sky-700 hover:underline"
        >
          ← Volver a Galería
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={`/gestion/galeria/${album.id}/editar`}
            className="rounded-xl bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-sky-800"
          >
            Editar álbum
          </Link>

          <span
            className={`rounded-full px-4 py-2 text-center text-sm font-semibold ${
              album.publicado
                ? "bg-green-100 text-green-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {album.publicado ? "Publicado" : "Borrador"}
          </span>

          {album.destacado && (
            <span className="rounded-full bg-sky-100 px-4 py-2 text-center text-sm font-semibold text-sky-800">
              Destacado
            </span>
          )}
        </div>
      </div>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {portada ? (
          <div className="aspect-[16/6] bg-slate-900">
            <img
              src={portada}
              alt={album.titulo_gl}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex min-h-56 items-center justify-center bg-slate-100 px-8 text-center font-semibold text-slate-400">
            Este álbum todavía no tiene fotografía de portada
          </div>
        )}

        <div className="p-6 lg:p-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <section>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">
                Gallego
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {album.titulo_gl}
              </h2>

              <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-600">
                {album.descripcion_gl || "Sin descripción."}
              </p>
            </section>

            <section>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">
                Castellano
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {album.titulo_es}
              </h2>

              <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-600">
                {album.descripcion_es || "Sin descripción."}
              </p>
            </section>
          </div>

          <dl className="mt-8 grid gap-5 border-t border-slate-200 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-sm font-semibold text-slate-500">
                Fecha del evento
              </dt>

              <dd className="mt-1 font-semibold text-slate-900">
                {mostrarFecha(album.fecha_evento)}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-semibold text-slate-500">
                Fotografías
              </dt>

              <dd className="mt-1 text-2xl font-bold text-slate-900">
                {fotografias}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-semibold text-slate-500">
                Vídeos
              </dt>

              <dd className="mt-1 text-2xl font-bold text-slate-900">
                {videos}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-semibold text-slate-500">
                Dirección interna
              </dt>

              <dd className="mt-1 break-words text-sm text-slate-700">
                {album.slug}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-900">
            Contenido del álbum
          </h2>

          <p className="mt-2 text-slate-600">
            Fotografías y vídeos asociados a esta colección.
          </p>
        </div>

        {elementos.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">
              Álbum vacío
            </h3>

            <p className="mt-2 text-slate-600">
              Todavía no se han añadido fotografías ni vídeos.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {elementos.map((elemento) => (
              <article
                key={elemento.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="aspect-video bg-slate-900">
                  {elemento.tipo === "imagen" ? (
                    <img
                      src={elemento.archivo_url}
                      alt={
                        elemento.alt_gl ||
                        elemento.alt_es ||
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
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wide text-sky-700">
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

                  {elemento.descripcion_gl && (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                      {elemento.descripcion_gl}
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

                  {elemento.fecha_captura && (
                    <p className="mt-2 text-sm text-slate-600">
                      <span className="font-semibold">
                        Fecha:
                      </span>{" "}
                      {mostrarFecha(elemento.fecha_captura)}
                    </p>
                  )}

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <Link
                      href={`/gestion/galeria/elemento/${elemento.id}/editar`}
                      className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
                    >
                      Editar archivo
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </LayoutGestion>
  );
}