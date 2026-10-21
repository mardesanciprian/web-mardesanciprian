
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LayoutGestion from "@/components/gestion/LayoutGestion";
import { crearActividad } from "../actions";

type NuevaActividadPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

function mensajeError(error?: string) {
  switch (error) {
    case "validacion":
      return "Revisa los títulos. Deben tener entre 3 y 200 caracteres.";
    case "fechas":
      return "Revisa las fechas. La fecha de finalización no puede ser anterior a la de inicio.";
    case "imagen":
      return "La dirección de la imagen debe comenzar por https:// o http://.";
    case "guardar":
      return "No se pudo guardar la actividad. Inténtalo de nuevo.";
    default:
      return null;
  }
}

export default async function NuevaActividadPage({
  searchParams,
}: NuevaActividadPageProps) {
  const { error } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/gestion");
  }

  const { data: administrador, error: adminError } =
    await supabase
      .from("administradores")
      .select("usuario_id")
      .eq("usuario_id", user.id)
      .maybeSingle();

  if (adminError || !administrador) {
    redirect("/gestion");
  }

  const avisoError = mensajeError(error);

  const campo =
    "w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100";

  return (
    <LayoutGestion
      seccionActiva="actividades"
      titulo="Nueva actividad"
      descripcion="Organiza una actividad en gallego y castellano y decide si quieres publicarla o guardarla como borrador."
    >
      {avisoError && (
        <div
          role="alert"
          className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-800"
        >
          {avisoError}
        </div>
      )}

      <form action={crearActividad} className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-slate-900">
            Contenido en gallego
          </h2>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="titulo_gl"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Título en gallego *
              </label>
              <input
                id="titulo_gl"
                name="titulo_gl"
                type="text"
                required
                minLength={3}
                maxLength={200}
                placeholder="Escribe o título da actividade"
                className={campo}
              />
            </div>

            <div>
              <label
                htmlFor="descripcion_gl"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Descripción en gallego
              </label>
              <textarea
                id="descripcion_gl"
                name="descripcion_gl"
                rows={8}
                placeholder="Describe a actividade en galego"
                className={campo}
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-slate-900">
            Contenido en castellano
          </h2>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="titulo_es"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Título en castellano *
              </label>
              <input
                id="titulo_es"
                name="titulo_es"
                type="text"
                required
                minLength={3}
                maxLength={200}
                placeholder="Escribe el título de la actividad"
                className={campo}
              />
            </div>

            <div>
              <label
                htmlFor="descripcion_es"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Descripción en castellano
              </label>
              <textarea
                id="descripcion_es"
                name="descripcion_es"
                rows={8}
                placeholder="Describe la actividad en castellano"
                className={campo}
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-slate-900">
            Organización de la actividad
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="fecha_inicio"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Fecha y hora de inicio
              </label>
              <input
                id="fecha_inicio"
                name="fecha_inicio"
                type="datetime-local"
                className={campo}
              />
            </div>

            <div>
              <label
                htmlFor="fecha_fin"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Fecha y hora de finalización
              </label>
              <input
                id="fecha_fin"
                name="fecha_fin"
                type="datetime-local"
                className={campo}
              />
            </div>

            <div>
              <label
                htmlFor="lugar"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Lugar
              </label>
              <input
                id="lugar"
                name="lugar"
                type="text"
                maxLength={200}
                placeholder="Ej. Puerto de San Ciprián"
                className={campo}
              />
            </div>

            <div>
              <label
                htmlFor="categoria"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Categoría
              </label>
              <select
                id="categoria"
                name="categoria"
                defaultValue=""
                className={campo}
              >
                <option value="">Seleccionar categoría</option>
                <option value="Náutica">Náutica</option>
                <option value="Cultura">Cultura</option>
                <option value="Deporte">Deporte</option>
                <option value="Social">Social</option>
                <option value="Medio ambiente">
                  Medio ambiente
                </option>
                <option value="Otras">Otras</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            Imagen de la actividad
          </h2>

          <p className="mb-5 text-sm text-slate-600">
            Introduce una dirección web de imagen. Más adelante
            podremos incorporar la subida directa desde la galería.
          </p>

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
            className={campo}
          />
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
                Si no marcas esta opción, la actividad se guardará
                como borrador.
              </span>
            </span>
          </label>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/gestion/actividades"
            className="rounded-xl border border-slate-300 px-7 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-7 py-3 font-semibold text-white transition hover:bg-sky-800"
          >
            Guardar actividad
          </button>
        </div>
      </form>
    </LayoutGestion>
  );
}
