import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LayoutGestion from "@/components/gestion/LayoutGestion";
import { editarNoticia } from "../../actions";

type EditarNoticiaPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
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
};

function mensajeError(error?: string) {
  switch (error) {
    case "validacion":
      return "Revisa los campos obligatorios. Los títulos, resúmenes y contenidos deben tener la longitud mínima indicada.";

    case "slug":
      return "No se pudo generar una dirección válida para la noticia.";

    case "consulta":
      return "No se pudieron consultar los datos actuales de la noticia.";

    case "guardar":
      return "No se pudieron guardar los cambios. Inténtalo de nuevo.";

    default:
      return null;
  }
}

export default async function EditarNoticiaPage({
  params,
  searchParams,
}: EditarNoticiaPageProps) {
  const { id } = await params;
  const { error } = await searchParams;

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

  const { data, error: consultaError } = await supabase
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
        fecha_publicacion
      `
    )
    .eq("id", noticiaId)
    .maybeSingle();

  if (consultaError) {
    console.error("Error al consultar la noticia para editar:", consultaError);
  }

  if (!data) {
    notFound();
  }

  const noticia = data as Noticia;
  const avisoError = mensajeError(error);

  return (
    <LayoutGestion
      seccionActiva="noticias"
      titulo="Editar noticia"
      descripcion={`Modifica el contenido de “${noticia.titulo_gl}”.`}
    >
      {avisoError && (
        <div
          role="alert"
          className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-800"
        >
          {avisoError}
        </div>
      )}

      <div className="mb-6">
        <Link
          href={`/gestion/noticias/${noticia.id}`}
          className="text-sm font-semibold text-sky-700 hover:underline"
        >
          ← Volver a la ficha de la noticia
        </Link>
      </div>

      <form action={editarNoticia} className="space-y-6">
        <input type="hidden" name="id" value={noticia.id} />

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Contenido en gallego
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  Esta será la versión principal de la noticia.
                </p>
              </div>

              <span className="w-fit rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-800">
                GL
              </span>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="titulo_gl"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Título en gallego
              </label>

              <input
                id="titulo_gl"
                name="titulo_gl"
                type="text"
                required
                minLength={3}
                maxLength={200}
                defaultValue={noticia.titulo_gl}
                placeholder="Escribe o título da nova"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div>
              <label
                htmlFor="resumen_gl"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Resumen en gallego
              </label>

              <textarea
                id="resumen_gl"
                name="resumen_gl"
                required
                minLength={10}
                maxLength={500}
                rows={4}
                defaultValue={noticia.resumen_gl ?? ""}
                placeholder="Escribe un resumo breve da nova"
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div>
              <label
                htmlFor="contenido_gl"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Contenido en gallego
              </label>

              <textarea
                id="contenido_gl"
                name="contenido_gl"
                required
                minLength={20}
                rows={14}
                defaultValue={noticia.contenido_gl}
                placeholder="Escribe o contido completo da nova"
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Contenido en castellano
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  Añade la traducción que se mostrará en la versión española.
                </p>
              </div>

              <span className="w-fit rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-800">
                ES
              </span>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="titulo_es"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Título en castellano
              </label>

              <input
                id="titulo_es"
                name="titulo_es"
                type="text"
                required
                minLength={3}
                maxLength={200}
                defaultValue={noticia.titulo_es}
                placeholder="Escribe el título de la noticia"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div>
              <label
                htmlFor="resumen_es"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Resumen en castellano
              </label>

              <textarea
                id="resumen_es"
                name="resumen_es"
                required
                minLength={10}
                maxLength={500}
                rows={4}
                defaultValue={noticia.resumen_es ?? ""}
                placeholder="Escribe un resumen breve de la noticia"
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div>
              <label
                htmlFor="contenido_es"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Contenido en castellano
              </label>

              <textarea
                id="contenido_es"
                name="contenido_es"
                required
                minLength={20}
                rows={14}
                defaultValue={noticia.contenido_es}
                placeholder="Escribe el contenido completo de la noticia"
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Imagen principal
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              De momento utilizaremos una dirección web. Más adelante
              conectaremos este campo con la galería de imágenes.
            </p>
          </div>

          {noticia.imagen_url && (
            <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <img
                src={noticia.imagen_url}
                alt={
                  noticia.imagen_alt_gl ||
                  noticia.imagen_alt_es ||
                  noticia.titulo_gl
                }
                className="max-h-96 w-full object-cover"
              />
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label
                htmlFor="imagen_url"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Dirección de la imagen
              </label>

              <input
                id="imagen_url"
                name="imagen_url"
                type="url"
                defaultValue={noticia.imagen_url ?? ""}
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="imagen_alt_gl"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Descripción de imagen en gallego
                </label>

                <input
                  id="imagen_alt_gl"
                  name="imagen_alt_gl"
                  type="text"
                  maxLength={250}
                  defaultValue={noticia.imagen_alt_gl ?? ""}
                  placeholder="Describe a imaxe"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label
                  htmlFor="imagen_alt_es"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Descripción de imagen en castellano
                </label>

                <input
                  id="imagen_alt_es"
                  name="imagen_alt_es"
                  type="text"
                  maxLength={250}
                  defaultValue={noticia.imagen_alt_es ?? ""}
                  placeholder="Describe la imagen"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Estado de publicación
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Puedes publicar la noticia o devolverla al estado de borrador.
            </p>
          </div>

          <label className="flex cursor-pointer items-start gap-4">
            <input
              name="publicada"
              type="checkbox"
              defaultChecked={noticia.publicada}
              className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-700 focus:ring-sky-600"
            />

            <span>
              <span className="block font-semibold text-slate-900">
                Noticia publicada
              </span>

              <span className="mt-1 block text-sm text-slate-600">
                Si desmarcas esta opción, la noticia dejará de mostrarse
                públicamente y quedará guardada como borrador.
              </span>
            </span>
          </label>

          <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span className="font-semibold text-slate-800">
              Dirección actual:
            </span>{" "}
            {noticia.slug}
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href={`/gestion/noticias/${noticia.id}`}
            className="rounded-xl border border-slate-300 px-7 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-7 py-3 font-semibold text-white transition hover:bg-sky-800"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </LayoutGestion>
  );
}