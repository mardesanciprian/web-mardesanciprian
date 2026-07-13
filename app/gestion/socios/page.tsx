import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LayoutGestion from "@/components/gestion/LayoutGestion";

type SociosPageProps = {
  searchParams: Promise<{
    q?: string;
    creado?: string;
  }>;
};

type Socio = {
  id: number;
  numero_socio: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string | null;
  localidad: string;
  provincia: string;
  fecha_inscripcion: string;
  activo: boolean;
};

function mostrarFecha(fecha: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${fecha}T12:00:00`));
}

export default async function SociosPage({
  searchParams,
}: SociosPageProps) {
  const { q, creado } = await searchParams;
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
    .from("socios")
    .select(
      `
        id,
        numero_socio,
        nombre,
        apellidos,
        email,
        telefono,
        localidad,
        provincia,
        fecha_inscripcion,
        activo
      `
    )
    .order("fecha_inscripcion", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    console.error("Error al consultar socios:", error);
  }

  const todosLosSocios = (data ?? []) as Socio[];
  const totalSocios = todosLosSocios.length;

  const sociosFiltrados = todosLosSocios.filter((socio) => {
    if (!busqueda) {
      return true;
    }

    const contenido = [
      socio.numero_socio,
      socio.nombre,
      socio.apellidos,
      socio.email,
      socio.telefono ?? "",
      socio.localidad,
      socio.provincia,
    ]
      .join(" ")
      .toLowerCase();

    return contenido.includes(busqueda);
  });

  return (
    <LayoutGestion
      seccionActiva="socios"
      titulo="Personas inscritas"
      descripcion="Consulta, edita o registra nuevas personas de la Asociación Mar de San Ciprián."
    >
      {creado === "1" && (
        <div
          role="status"
          className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-800"
        >
          El nuevo socio se ha registrado correctamente.
        </div>
      )}

      <section className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:justify-between">
        <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Total de socios
          </p>

          <p className="mt-2 text-4xl font-bold text-slate-900">
            {totalSocios}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Personas inscritas actualmente
          </p>
        </div>

        <Link
          href="/gestion/socios/nuevo"
          className="flex min-h-36 items-center justify-center rounded-3xl bg-slate-900 px-8 py-6 text-center text-lg font-semibold text-white shadow-sm transition hover:bg-sky-800 sm:min-w-56"
        >
          + Nuevo socio
        </Link>
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <form className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="q" className="sr-only">
            Buscar socio
          </label>

          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q ?? ""}
            placeholder="Buscar por nombre, correo, localidad o número de socio"
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
              href="/gestion/socios"
              className="rounded-xl border border-slate-300 px-7 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Limpiar
            </Link>
          )}
        </form>

        {busqueda && (
          <p className="mt-4 text-sm text-slate-500">
            Resultados encontrados: {sociosFiltrados.length}
          </p>
        )}
      </section>

      {error ? (
        <section className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-800">
          No se pudieron cargar los socios.
        </section>
      ) : sociosFiltrados.length === 0 ? (
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">
            No se encontraron socios
          </h3>

          <p className="mt-3 text-slate-600">
            {busqueda
              ? "No hay resultados que coincidan con la búsqueda."
              : "Todavía no hay personas inscritas."}
          </p>
        </section>
      ) : (
        <section className="mt-6 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {sociosFiltrados.map((socio) => (
            <article
              key={socio.id}
              className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-sky-700">
                    {socio.numero_socio}
                  </p>

                  <h3 className="mt-1 break-words text-xl font-bold text-slate-900">
                    {socio.nombre} {socio.apellidos}
                  </h3>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    socio.activo
                      ? "bg-green-100 text-green-800"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {socio.activo ? "Activo" : "Inactivo"}
                </span>
              </div>

              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-slate-500">
                    Correo electrónico
                  </dt>

                  <dd className="mt-1 break-words text-slate-800">
                    {socio.email}
                  </dd>
                </div>

                <div>
                  <dt className="font-semibold text-slate-500">
                    Teléfono
                  </dt>

                  <dd className="mt-1 text-slate-800">
                    {socio.telefono || "No facilitado"}
                  </dd>
                </div>

                <div>
                  <dt className="font-semibold text-slate-500">
                    Localidad
                  </dt>

                  <dd className="mt-1 text-slate-800">
                    {socio.localidad}, {socio.provincia}
                  </dd>
                </div>

                <div>
                  <dt className="font-semibold text-slate-500">
                    Fecha de inscripción
                  </dt>

                  <dd className="mt-1 text-slate-800">
                    {mostrarFecha(socio.fecha_inscripcion)}
                  </dd>
                </div>
              </dl>

              <div className="mt-auto grid gap-3 pt-6 sm:grid-cols-2">
                <Link
                  href={`/gestion/socios/${socio.id}`}
                  className="rounded-xl bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-sky-800"
                >
                  Ver ficha
                </Link>

                <Link
                  href={`/gestion/socios/${socio.id}/editar`}
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