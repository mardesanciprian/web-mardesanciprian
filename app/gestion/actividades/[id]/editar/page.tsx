
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LayoutGestion from "@/components/gestion/LayoutGestion";
import { actualizarActividad } from "../../actions";

type EditarActividadPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

type Actividad = {
  id: string;
  titulo_gl: string;
  titulo_es: string;
  descripcion_gl: string | null;
  descripcion_es: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  lugar: string | null;
  categoria: string | null;
  imagen_url: string | null;
  estado: string;
};

function fechaParaFormulario(fecha: string | null) {
  if (!fecha) return "";

  const fechaObjeto = new Date(fecha);

  if (Number.isNaN(fechaObjeto.getTime())) return "";

  // Mostrar la fecha en horario de España peninsular.
  const partes = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(fechaObjeto);

  const valor = (tipo: string) =>
    partes.find((parte) => parte.type === tipo)?.value ?? "";

  return `${valor("year")}-${valor("month")}-${valor("day")}T${valor("hour")}:${valor("minute")}`;
}

function mensajeError(error?: string) {
  switch (error) {
    case "validacion":
      return "Los títulos deben tener entre 3 y 200 caracteres.";
    case "fechas":
      return "Comprueba las fechas de inicio y finalización.";
    case "imagen":
      return "La dirección de imagen debe comenzar por http:// o https://.";
    case "guardar":
      return "No se pudieron guardar los cambios. Inténtalo de nuevo.";
    default:
      return null;
  }
}

export default async function EditarActividadPage({
  params,
  searchParams,
}: EditarActividadPageProps) {
  const { id } = await params;
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

  const { data, error: consultaError } = await supabase
    .from("actividades")
    .select(
      "id, titulo_gl, titulo_es, descripcion_gl, descripcion_es, fecha_inicio, fecha_fin, lugar, categoria, imagen_url, estado"
    )
    .eq("id", id)
    .maybeSingle();

  if (consultaError || !data) {
    notFound();
  }

  const actividad = data as Actividad;
  const avisoError = mensajeError(error);

  const campo =
    "w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100";

  return (
    <LayoutGestion
      seccionActiva="actividades"
      titulo="Editar actividad"
      descripcion="Modifica la información y decide si la actividad debe estar publicada."
    >
      {avisoError && (
        <div
          role="alert"
          className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-800"
        >
          {avisoError}
        </div>
      )}

      <form action={actualizarActividad} className="space-y-6">
        <input type="hidden" name="id" value={actividad.id} />

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-slate-900">
            Contenido en gallego
          </h2>

          <div className="space-y-5">
            <div>
              <label htmlFor="titulo_gl" className="mb-2 block text-sm font-semibold text-slate-700">
                Título en gallego *
              </label>
              <input
                id="titulo_gl"
                name="titulo_gl"
                required
                minLength={3}
                maxLength={200}
                defaultValue={actividad.titulo_gl}
                className={campo}
              />
            </div>

            <div>
              <label htmlFor="descripcion_gl" className="mb-2 block text-sm font-semibold text-slate-700">
                Descripción en gallego
              </label>
              <textarea
                id="descripcion_gl"
                name="descripcion_gl"
                rows={7}
                defaultValue={actividad.descripcion_gl ?? ""}
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
              <label htmlFor="titulo_es" className="mb-2 block text-sm font-semibold text-slate-700">
                Título en castellano *
              </label>
              <input
                id="titulo_es"
                name="titulo_es"
                required
                minLength={3}
                maxLength={200}
                defaultValue={actividad.titulo_es}
                className={campo}
              />
            </div>

            <div>
              <label htmlFor="descripcion_es" className="mb-2 block text-sm font-semibold text-slate-700">
                Descripción en castellano
              </label>
              <textarea
                id="descripcion_es"
                name="descripcion_es"
                rows={7}
                defaultValue={actividad.descripcion_es ?? ""}
                className={campo}
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-slate-900">
            Organización
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="fecha_inicio" className="mb-2 block text-sm font-semibold text-slate-700">
                Fecha y hora de inicio
              </label>
              <input
                id="fecha_inicio"
                name="fecha_inicio"
                type="datetime-local"
                defaultValue={fechaParaFormulario(actividad.fecha_inicio)}
                className={campo}
              />
            </div>

            <div>
              <label htmlFor="fecha_fin" className="mb-2 block text-sm font-semibold text-slate-700">
                Fecha y hora de finalización
              </label>
              <input
                id="fecha_fin"
                name="fecha_fin"
                type="datetime-local"
                defaultValue={fechaParaFormulario(actividad.fecha_fin)}
                className={campo}
              />
            </div>

            <div>
              <label htmlFor="lugar" className="mb-2 block text-sm font-semibold text-slate-700">
                Lugar
              </label>
              <input
                id="lugar"
                name="lugar"
                maxLength={200}
                defaultValue={actividad.lugar ?? ""}
                className={campo}
              />
            </div>

            <div>
              <label htmlFor="categoria" className="mb-2 block text-sm font-semibold text-slate-700">
                Categoría
              </label>
              <select
                id="categoria"
                name="categoria"
                defaultValue={actividad.categoria ?? ""}
                className={campo}
              >
                <option value="">Seleccionar categoría</option>
                <option value="Náutica">Náutica</option>
                <option value="Cultura">Cultura</option>
                <option value="Deporte">Deporte</option>
                <option value="Social">Social</option>
                <option value="Medio ambiente">Medio ambiente</option>
                <option value="Otras">Otras</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            Imagen principal
          </h2>

          <label htmlFor="imagen_url" className="mb-2 block text-sm font-semibold text-slate-700">
            Dirección de la imagen
          </label>
          <input
            id="imagen_url"
            name="imagen_url"
            type="url"
            defaultValue={actividad.imagen_url ?? ""}
            placeholder="https://..."
            className={campo}
          />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="flex cursor-pointer items-start gap-4">
            <input
              name="publicada"
              type="checkbox"
              defaultChecked={actividad.estado === "publicada"}
              className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-700 focus:ring-sky-600"
            />
            <span>
              <span className="block font-semibold text-slate-900">
                Actividad publicada
              </span>
              <span className="mt-1 block text-sm text-slate-600">
                Desmarca esta casilla para mantenerla como borrador.
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
            Guardar cambios
          </button>
        </div>
      </form>
    </LayoutGestion>
  );
}
