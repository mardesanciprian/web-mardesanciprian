import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LayoutGestion from "@/components/gestion/LayoutGestion";

export default async function BitacoraPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/gestion");
  }

  const { count: totalSocios } = await supabase
    .from("socios")
    .select("*", { count: "exact", head: true });

  return (
    <LayoutGestion
      seccionActiva="bitacora"
      titulo="Estado de la Asociación"
      descripcion="Resumen general del Centro de Gestión y acceso rápido a los principales módulos de trabajo."
    >
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Socios inscritos
          </p>

          <p className="mt-3 text-4xl font-bold text-slate-900">
            {totalSocios ?? 0}
          </p>

          <Link
            href="/gestion/socios"
            className="mt-5 inline-block text-sm font-semibold text-sky-700 hover:underline"
          >
            Ver socios
          </Link>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Noticias
          </p>

          <p className="mt-3 text-4xl font-bold text-slate-900">
            —
          </p>

          <p className="mt-5 text-sm text-slate-500">
            Módulo pendiente de activar
          </p>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Galería
          </p>

          <p className="mt-3 text-4xl font-bold text-slate-900">
            —
          </p>

          <p className="mt-5 text-sm text-slate-500">
            Módulo pendiente de activar
          </p>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Actividades
          </p>

          <p className="mt-3 text-4xl font-bold text-slate-900">
            —
          </p>

          <p className="mt-5 text-sm text-slate-500">
            Módulo pendiente de activar
          </p>
        </article>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900">
          Bitácora
        </h3>

        <p className="mt-3 leading-7 text-slate-600">
          El Centro de Gestión está operativo y protegido mediante
          autenticación. Desde este espacio se coordinarán los socios,
          noticias, actividades, galería y documentación de Mar de San
          Ciprián.
        </p>

        <p className="mt-5 text-sm text-slate-500">
          Sesión iniciada como: {user.email}
        </p>
      </section>
    </LayoutGestion>
  );
}