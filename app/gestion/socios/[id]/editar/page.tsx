import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LayoutGestion from "@/components/gestion/LayoutGestion";
import { actualizarSocio } from "../actions";

type EditarSocioPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

type Socio = {
  id: number;
  numero_socio: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string | null;
  dni_nie: string | null;
  fecha_nacimiento: string | null;
  direccion: string | null;
  codigo_postal: string | null;
  localidad: string;
  provincia: string;
  pais: string;
};

export default async function EditarSocioPage({
  params,
  searchParams,
}: EditarSocioPageProps) {
  const { id } = await params;
  const { error: errorParam } = await searchParams;
  const socioId = Number(id);

  if (!Number.isInteger(socioId) || socioId <= 0) {
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
    .from("socios")
    .select(
      `
        id,
        numero_socio,
        nombre,
        apellidos,
        email,
        telefono,
        dni_nie,
        fecha_nacimiento,
        direccion,
        codigo_postal,
        localidad,
        provincia,
        pais
      `
    )
    .eq("id", socioId)
    .maybeSingle();

  if (error) {
    console.error("Error al cargar el socio:", error);
  }

  if (!data) {
    notFound();
  }

  const socio = data as Socio;
  const accionActualizar = actualizarSocio.bind(null, socio.id);

  const campo =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100";

  const etiqueta =
    "mb-2 block text-sm font-semibold text-slate-800";

  return (
    <LayoutGestion
      seccionActiva="socios"
      titulo="Editar socio"
      descripcion={`Modificación de la ficha ${socio.numero_socio}.`}
    >
      <div className="mb-6">
        <Link
          href={`/gestion/socios/${socio.id}`}
          className="text-sm font-semibold text-sky-700 hover:underline"
        >
          ← Volver a la ficha
        </Link>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {errorParam && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
          >
            No se pudieron guardar los cambios. Revisa los datos e inténtalo
            nuevamente.
          </div>
        )}

        <form action={accionActualizar} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="nombre" className={etiqueta}>
                Nombre *
              </label>

              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                minLength={2}
                maxLength={100}
                defaultValue={socio.nombre}
                className={campo}
              />
            </div>

            <div>
              <label htmlFor="apellidos" className={etiqueta}>
                Apellidos *
              </label>

              <input
                id="apellidos"
                name="apellidos"
                type="text"
                required
                minLength={2}
                maxLength={150}
                defaultValue={socio.apellidos}
                className={campo}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className={etiqueta}>
                Correo electrónico *
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={254}
                defaultValue={socio.email}
                className={campo}
              />
            </div>

            <div>
              <label htmlFor="telefono" className={etiqueta}>
                Teléfono
              </label>

              <input
                id="telefono"
                name="telefono"
                type="tel"
                maxLength={30}
                defaultValue={socio.telefono ?? ""}
                className={campo}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="dni_nie" className={etiqueta}>
                DNI / NIE
              </label>

              <input
                id="dni_nie"
                name="dni_nie"
                type="text"
                maxLength={20}
                defaultValue={socio.dni_nie ?? ""}
                className={campo}
              />
            </div>

            <div>
              <label htmlFor="fecha_nacimiento" className={etiqueta}>
                Fecha de nacimiento
              </label>

              <input
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                type="date"
                defaultValue={socio.fecha_nacimiento ?? ""}
                className={campo}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-[1fr_160px]">
            <div>
              <label htmlFor="direccion" className={etiqueta}>
                Dirección
              </label>

              <input
                id="direccion"
                name="direccion"
                type="text"
                maxLength={200}
                defaultValue={socio.direccion ?? ""}
                className={campo}
              />
            </div>

            <div>
              <label htmlFor="codigo_postal" className={etiqueta}>
                Código postal
              </label>

              <input
                id="codigo_postal"
                name="codigo_postal"
                type="text"
                maxLength={12}
                defaultValue={socio.codigo_postal ?? ""}
                className={campo}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="localidad" className={etiqueta}>
                Localidad *
              </label>

              <input
                id="localidad"
                name="localidad"
                type="text"
                required
                minLength={2}
                maxLength={100}
                defaultValue={socio.localidad}
                className={campo}
              />
            </div>

            <div>
              <label htmlFor="provincia" className={etiqueta}>
                Provincia *
              </label>

              <input
                id="provincia"
                name="provincia"
                type="text"
                required
                minLength={2}
                maxLength={100}
                defaultValue={socio.provincia}
                className={campo}
              />
            </div>

            <div>
              <label htmlFor="pais" className={etiqueta}>
                País
              </label>

              <input
                id="pais"
                name="pais"
                type="text"
                maxLength={100}
                defaultValue={socio.pais}
                className={campo}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <Link
              href={`/gestion/socios/${socio.id}`}
              className="rounded-xl border border-slate-300 px-6 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-8 py-3 font-semibold text-white transition hover:bg-sky-800"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </section>
    </LayoutGestion>
  );
}