import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LayoutGestion from "@/components/gestion/LayoutGestion";
import { crearNoticia } from "../actions";

type NuevaNoticiaPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

function mensajeError(error?: string) {
  switch (error) {
    case "validacion":
      return "Revisa los campos obligatorios. Los títulos, resúmenes y contenidos deben tener la longitud mínima indicada.";
    case "slug":
      return "No se pudo generar una dirección válida para la noticia.";
    case "guardar":
      return "No se pudo guardar la noticia. Inténtalo de nuevo.";
    default:
      return null;
  }
}

export default async function NuevaNoticiaPage({
  searchParams,
}: NuevaNoticiaPageProps) {
  const { error } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/gestion");
  }

  const avisoError = mensajeError(error);

  return (
    <LayoutGestion
      seccionActiva="noticias"
      titulo="Nueva noticia"
      descripcion="Redacta una noticia en gallego y castellano y decide si quieres publicarla ahora o guardarla como borrador."
    >
      {avisoError && (
        <div
          role="alert"
          className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-800"
        >
          {avisoError}
        </div>
      )}

      <form action={crearNoticia} className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Contenido en gallego
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Esta será la versión principal de la noticia.
            </p>
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
                placeholder="Escribe o contido completo da nova"
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Contenido en castellano
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Añade la traducción que se mostrará en la versión española.
            </p>
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
              De momento utilizaremos una dirección web de imagen. Más adelante
              conectaremos la subida directa desde la galería.
            </p>
          </div>

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
                  placeholder="Describe la imagen"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="flex cursor-pointer items-start gap-4">
            <input
              name="publicada"
              type="checkbox"
              className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-700 focus:ring-sky-600"
            />

            <span>
              <span className="block font-semibold text-slate-900">
                Publicar inmediatamente
              </span>

              <span className="mt-1 block text-sm text-slate-600">
                Si no marcas esta opción, la noticia quedará guardada como
                borrador.
              </span>
            </span>
          </label>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/gestion/noticias"
            className="rounded-xl border border-slate-300 px-7 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-7 py-3 font-semibold text-white transition hover:bg-sky-800"
          >
            Guardar noticia
          </button>
        </div>
      </form>
    </LayoutGestion>
  );
}