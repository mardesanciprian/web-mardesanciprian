import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LayoutGestion from "@/components/gestion/LayoutGestion";

type FichaNoticiaPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    ok?: string;
  }>;
};

type Noticia = {
  id: number;
  titulo_gl: string;
  titulo_es: string;
  resumen_gl: string | null;
  resumen_es: string | null;
  contenido_gl: string;
  contenido_es: string;
  slug: string;
  imagen_url: string | null;
  imagen_alt_gl: string | null;
  imagen_alt_es: string | null;
  publicada: boolean;
  fecha_publicacion: string | null;
  autor_id: string | null;
  created_at: string;
  updated_at: string;
};

function mostrarFecha(fecha: string | null) {
  if (!fecha) {
    return "No disponible";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(fecha));
}

function mostrarDato(valor: string | null) {
  return valor?.trim() ? valor : "No facilitado";
}

export default async function FichaNoticiaPage({
  params,
  searchParams,
}: FichaNoticiaPageProps) {
  const { id } = await params;
  const { ok } = await searchParams;

  const noticiaId = Number(id);

  if (!Number.isInteger(noticiaId) || noticiaId <= 0) {
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
        publicada,
        fecha_publicacion,
        autor_id,
        created_at,
        updated_at
      `
    )
    .eq("id", noticiaId)
    .maybeSingle();

  if (error) {
    console.error("Error al consultar la noticia:", error);
  }

  if (!data) {
    notFound();
  }

  const noticia = data as Noticia;

  return (
    <LayoutGestion
      seccionActiva="noticias"
      titulo={noticia.titulo_gl}
      descripcion={`Ficha interna de la noticia número ${noticia.id}.`}
    >
      {ok === "1" && (
        <div
          role="status"
          className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-800"
        >
          Los cambios se han guardado correctamente.
        </div>
      )}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/gestion/noticias"
          className="text-sm font-semibold text-sky-700 hover:underline"
        >
          ← Volver a noticias
        </Link>

        <Link
          href={`/gestion/noticias/${noticia.id}/editar`}
          className="inline-flex items-center justify-center rounded-xl bg-sky-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-800"
        >
          Editar noticia
        </Link>
      </div>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Estado de publicación
              </p>

              <div className="mt-2">
                {noticia.publicada ? (
                  <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-800">
                    Publicada
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">
                    Borrador
                  </span>
                )}
              </div>
            </div>

            <div className="text-sm text-slate-600">
              <p>
                <span className="font-semibold">Identificador:</span>{" "}
                {noticia.id}
              </p>
              <p className="mt-1">
                <span className="font-semibold">Slug:</span> {noticia.slug}
              </p>
            </div>
          </div>
        </div>

        {noticia.imagen_url && (
          <div className="border-b border-slate-200 bg-slate-100">
            <img
              src={noticia.imagen_url}
              alt={
                noticia.imagen_alt_gl ||
                noticia.imagen_alt_es ||
                noticia.titulo_gl
              }
              className="h-auto max-h-[520px] w-full object-cover"
            />
          </div>
        )}

        <div className="grid gap-10 p-6 lg:grid-cols-2 lg:p-8">
          <section>
            <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="text-xl font-bold text-slate-900">
                Versión en gallego
              </h2>

              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-800">
                GL
              </span>
            </div>

            <dl className="space-y-6">
              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  Título
                </dt>
                <dd className="mt-1 text-lg font-bold text-slate-900">
                  {noticia.titulo_gl}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  Resumo
                </dt>
                <dd className="mt-2 whitespace-pre-wrap leading-7 text-slate-700">
                  {mostrarDato(noticia.resumen_gl)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  Contido
                </dt>
                <dd className="mt-2 whitespace-pre-wrap leading-7 text-slate-700">
                  {noticia.contenido_gl}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  Texto alternativo da imaxe
                </dt>
                <dd className="mt-1 text-slate-700">
                  {mostrarDato(noticia.imagen_alt_gl)}
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="text-xl font-bold text-slate-900">
                Versión en español
              </h2>

              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-800">
                ES
              </span>
            </div>

            <dl className="space-y-6">
              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  Título
                </dt>
                <dd className="mt-1 text-lg font-bold text-slate-900">
                  {noticia.titulo_es}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  Resumen
                </dt>
                <dd className="mt-2 whitespace-pre-wrap leading-7 text-slate-700">
                  {mostrarDato(noticia.resumen_es)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  Contenido
                </dt>
                <dd className="mt-2 whitespace-pre-wrap leading-7 text-slate-700">
                  {noticia.contenido_es}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  Texto alternativo de la imagen
                </dt>
                <dd className="mt-1 text-slate-700">
                  {mostrarDato(noticia.imagen_alt_es)}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-6 py-6 lg:px-8">
          <h2 className="text-lg font-bold text-slate-900">
            Datos internos del registro
          </h2>

          <dl className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-sm font-semibold text-slate-500">
                Fecha de publicación
              </dt>
              <dd className="mt-1 text-slate-900">
                {mostrarFecha(noticia.fecha_publicacion)}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-semibold text-slate-500">
                Registro creado
              </dt>
              <dd className="mt-1 text-slate-900">
                {mostrarFecha(noticia.created_at)}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-semibold text-slate-500">
                Última actualización
              </dt>
              <dd className="mt-1 text-slate-900">
                {mostrarFecha(noticia.updated_at)}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-semibold text-slate-500">
                Autor interno
              </dt>
              <dd className="mt-1 break-all text-slate-900">
                {mostrarDato(noticia.autor_id)}
              </dd>
            </div>
          </dl>

          {noticia.imagen_url && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-slate-500">
                Dirección de la imagen
              </p>
              <p className="mt-1 break-all text-sm text-slate-700">
                {noticia.imagen_url}
              </p>
            </div>
          )}
        </div>
      </section>
    </LayoutGestion>
  );
}