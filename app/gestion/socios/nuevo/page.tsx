import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LayoutGestion from "@/components/gestion/LayoutGestion";
import { crearSocio } from "../actions";

type NuevoSocioPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NuevoSocioPage({
  searchParams,
}: NuevoSocioPageProps) {
  const { error } = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/gestion");
  }

  const campo =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100";

  const etiqueta =
    "mb-2 block text-sm font-semibold text-slate-800";

  return (
    <LayoutGestion
      seccionActiva="socios"
      titulo="Nuevo socio"
      descripcion="Registro presencial de una persona que desea formar parte de Mar de San Ciprián."
    >
      <div className="mb-6">
        <Link
          href="/gestion/socios"
          className="text-sm font-semibold text-sky-700 hover:underline"
        >
          ← Volver al listado de socios
        </Link>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
          >
            {error}
          </div>
        )}

        <form action={crearSocio} className="space-y-5">
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
                autoComplete="given-name"
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
                autoComplete="family-name"
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
                autoComplete="email"
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
                autoComplete="tel"
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
                autoComplete="off"
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
                autoComplete="bday"
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
                autoComplete="street-address"
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
                autoComplete="postal-code"
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
                autoComplete="address-level2"
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
                autoComplete="address-level1"
                defaultValue="Lugo"
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
                autoComplete="country-name"
                defaultValue="España"
                className={campo}
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
            La persona confirma que desea inscribirse en la Asociación Mar de
            San Ciprián y autoriza el tratamiento de sus datos para gestionar
            su ficha y las comunicaciones propias de la asociación.
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              * Campos obligatorios.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/gestion/socios"
                className="rounded-xl border border-slate-300 px-6 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-8 py-3 font-semibold text-white transition hover:bg-sky-800"
              >
                Registrar socio
              </button>
            </div>
          </div>
        </form>
      </section>
    </LayoutGestion>
  );
}