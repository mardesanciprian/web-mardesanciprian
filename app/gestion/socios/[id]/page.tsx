import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LayoutGestion from "@/components/gestion/LayoutGestion";

type FichaSocioPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    ok?: string;
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
  fecha_inscripcion: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
};

function mostrarFecha(fecha: string | null) {
  if (!fecha) {
    return "No facilitada";
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

function mostrarDato(valor: string | null) {
  return valor?.trim() ? valor : "No facilitado";
}

export default async function FichaSocioPage({
  params,
  searchParams,
}: FichaSocioPageProps) {
  const { id } = await params;
  const { ok } = await searchParams;

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
        pais,
        fecha_inscripcion,
        activo,
        created_at,
        updated_at
      `
    )
    .eq("id", socioId)
    .maybeSingle();

  if (error) {
    console.error("Error al consultar la ficha del socio:", error);
  }

  if (!data) {
    notFound();
  }

  const socio = data as Socio;

  return (
    <LayoutGestion
      seccionActiva="socios"
      titulo={`${socio.nombre} ${socio.apellidos}`}
      descripcion={`Ficha interna ${socio.numero_socio}.`}
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
          href="/gestion/socios"
          className="text-sm font-semibold text-sky-700 hover:underline"
        >
          ← Volver al listado de socios
        </Link>

        <Link
          href={`/gestion/socios/${socio.id}/editar`}
          className="rounded-xl bg-slate-900 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-sky-800"
        >
          Editar ficha
        </Link>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
              {socio.numero_socio}
            </p>

            <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {socio.nombre} {socio.apellidos}
            </h3>

            <p className="mt-3 text-slate-600">
              Inscrito desde el {mostrarFecha(socio.fecha_inscripcion)}
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
              socio.activo
                ? "bg-green-100 text-green-800"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {socio.activo ? "Activo" : "Inactivo"}
          </span>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <section>
            <h4 className="text-lg font-bold text-slate-900">
              Datos de contacto
            </h4>

            <dl className="mt-5 space-y-5">
              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  Correo electrónico
                </dt>
                <dd className="mt-1 break-words text-slate-900">
                  {socio.email}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  Teléfono
                </dt>
                <dd className="mt-1 text-slate-900">
                  {mostrarDato(socio.telefono)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  Dirección
                </dt>
                <dd className="mt-1 text-slate-900">
                  {mostrarDato(socio.direccion)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  Código postal
                </dt>
                <dd className="mt-1 text-slate-900">
                  {mostrarDato(socio.codigo_postal)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  Localidad
                </dt>
                <dd className="mt-1 text-slate-900">
                  {socio.localidad}, {socio.provincia}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  País
                </dt>
                <dd className="mt-1 text-slate-900">
                  {socio.pais}
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h4 className="text-lg font-bold text-slate-900">
              Datos personales y registro
            </h4>

            <dl className="mt-5 space-y-5">
              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  DNI / NIE
                </dt>
                <dd className="mt-1 text-slate-900">
                  {mostrarDato(socio.dni_nie)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  Fecha de nacimiento
                </dt>
                <dd className="mt-1 text-slate-900">
                  {mostrarFecha(socio.fecha_nacimiento)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  Fecha de inscripción
                </dt>
                <dd className="mt-1 text-slate-900">
                  {mostrarFecha(socio.fecha_inscripcion)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  Registro creado
                </dt>
                <dd className="mt-1 text-slate-900">
                  {mostrarFecha(socio.created_at)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  Última actualización
                </dt>
                <dd className="mt-1 text-slate-900">
                  {mostrarFecha(socio.updated_at)}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </section>
    </LayoutGestion>
  );
}