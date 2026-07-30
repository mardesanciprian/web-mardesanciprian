import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LayoutGestion from "@/components/gestion/LayoutGestion";

type NoticiasPageProps = {
  searchParams: Promise<{
    q?: string;
    creada?: string;
  }>;
};

type Noticia = {
  id: number;
  titulo_gl: string;
  titulo_es: string;
  resumen_gl: string;
  slug: string;
  publicada: boolean;
  fecha_publicacion: string | null;
  created_at: string;
};

function mostrarFecha(fecha: string | null) {
  if (!fecha) {
    return "Sin publicar";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(fecha));
}

export default async function NoticiasGestionPage({
  searchParams,
}: NoticiasPageProps) {
  const { q, creada } = await searchParams;
  const busqueda = (q ?? "").trim().toLowerCase();

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
        slug,
        publicada,
        fecha_publicacion,
        created_at
      `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al consultar noticias:", error);
  }

  const todasLasNoticias = (data ?? []) as Noticia[];

  const noticiasFiltradas = todasLasNoticias.filter((noticia) => {
    if (!busqueda) {
      return true;
    }

    const contenido = [
      noticia.titulo_gl,
      noticia.titulo_es,
      noticia.resumen_gl,
      noticia.slug,
      noticia.publicada ? "publicada" : "borrador",
    ]
      .join(" ")
      .toLowerCase();

    return contenido.includes(busqueda);
  });

  const totalNoticias = todasLasNoticias.length;
  const totalPublicadas = todasLasNoticias.filter(
    (noticia) => noticia.publicada
  ).length;
  const totalBorradores = totalNoticias - totalPublicadas;

  return (
    <LayoutGestion
      seccionActiva="noticias"
      titulo="Noticias"
      descripcion="Crea, revisa y publica las noticias de la Asociación Mar de San Ciprián."
    >
      {creada === "1" && (
        <div
          role="status"
          className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-800"
        >
          La noticia se ha guardado correctamente.
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Total de noticias
          </p>

          <p className="mt-2 text-4xl font-bold text-slate-900">
            {totalNoticias}
          </p>
        </article>

        <article className="rounded-3xl border border-green-200 bg-green-50 p-6 shadow-sm">
          <p className="text-sm font-semibold text-green-700">
            Publicadas
          </p>

          <p className="mt-2 text-4xl font-bold text-green-900">
            {totalPublicadas}
          </p>
        </article>

        <article className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <p className="text-sm font-semibold text-amber-700">
            Borradores
          </p>

          <p className="mt-2 text-4xl font-bold text-amber-900">
            {totalBorradores}
          </p>
        </article>
      </section>

      <section className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-stretch sm:justify-between">
        <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <form className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="q" className="sr-only">
              Buscar noticia
            </label>

            <input
              id="q"
              name="q"
              type="search"
              defaultValue={q ?? ""}
              placeholder="Buscar por título, resumen o estado"
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
            />

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-7 py-3 font-semibold text-white transition hover:bg-sky-800"
            >
              Buscar
            </button>

            {busqueda && (
              <Link
                href="/gestion/noticias"
                className="rounded-xl border border-slate-300 px-7 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Limpiar
              </Link>
            )}
          </form>

          {busqueda && (
            <p className="mt-4 text-sm text-slate-500">
              Resultados encontrados: {noticiasFiltradas.length}
            </p>
          )}
        </div>

        <Link
          href="/gestion/noticias/nueva"
          className="flex min-h-28 items-center justify-center rounded-3xl bg-slate-900 px-8 py-6 text-center text-lg font-semibold text-white shadow-sm transition hover:bg-sky-800 sm:min-w-56"
        >
          + Nueva noticia
        </Link>
      </section>

      {error ? (
        <section className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-800">
          No se pudieron cargar las noticias.
        </section>
      ) : noticiasFiltradas.length === 0 ? (
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            No se encontraron noticias
          </h2>

          <p className="mt-3 text-slate-600">
            {busqueda
              ? "No hay noticias que coincidan con la búsqueda."
              : "Todavía no se ha creado ninguna noticia."}
          </p>
        </section>
      ) : (
        <section className="mt-6 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {noticiasFiltradas.map((noticia) => (
            <article
              key={noticia.id}
              className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-sky-700">
                    Noticia #{noticia.id}
                  </p>

                  <h2 className="mt-2 break-words text-xl font-bold text-slate-900">
                    {noticia.titulo_gl}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {noticia.titulo_es}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    noticia.publicada
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {noticia.publicada ? "Publicada" : "Borrador"}
                </span>
              </div>

              <p className="mt-5 line-clamp-4 text-sm leading-6 text-slate-600">
                {noticia.resumen_gl}
              </p>

              <dl className="mt-5 space-y-3 text-sm">
                <div>
                  <dt className="font-semibold text-slate-500">
                    Dirección
                  </dt>

                  <dd className="mt-1 break-words text-slate-800">
                    {noticia.slug}
                  </dd>
                </div>

                <div>
                  <dt className="font-semibold text-slate-500">
                    Fecha de publicación
                  </dt>

                  <dd className="mt-1 text-slate-800">
                    {mostrarFecha(noticia.fecha_publicacion)}
                  </dd>
                </div>
              </dl>

              <div className="mt-auto grid gap-3 pt-6 sm:grid-cols-2">
                <Link
                  href={`/gestion/noticias/${noticia.id}`}
                  className="rounded-xl bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-sky-800"
                >
                  Ver noticia
                </Link>

                <Link
                  href={`/gestion/noticias/${noticia.id}/editar`}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Editar
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </LayoutGestion>
  );
}