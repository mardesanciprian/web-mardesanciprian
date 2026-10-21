
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

  const [
    sociosResult,
    noticiasResult,
    noticiasPublicadasResult,
    albumesResult,
    archivosResult,
  ] = await Promise.all([
    supabase
      .from("socios")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("noticias")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("noticias")
      .select("*", { count: "exact", head: true })
      .eq("publicada", true),

    supabase
      .from("galeria_albumes")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("galeria_elementos")
      .select("*", { count: "exact", head: true }),
  ]);

  const totalSocios = sociosResult.count;
  const totalNoticias = noticiasResult.count;
  const noticiasPublicadas = noticiasPublicadasResult.count;
  const totalAlbumes = albumesResult.count;
  const totalArchivos = archivosResult.count;

  const tarjetas = [
    {
      titulo: "Socios inscritos",
      valor: totalSocios,
      detalle: "Registro de socios",
      enlace: "/gestion/socios",
      textoEnlace: "Gestionar socios",
    },
    {
      titulo: "Noticias",
      valor: totalNoticias,
      detalle:
        noticiasPublicadas === null
          ? "Publicaciones no disponibles"
          : `${noticiasPublicadas} publicadas`,
      enlace: "/gestion/noticias",
      textoEnlace: "Gestionar noticias",
    },
    {
      titulo: "Galería",
      valor: totalAlbumes,
      detalle:
        totalArchivos === null
          ? "Archivos no disponibles"
          : `${totalArchivos} archivos multimedia`,
      enlace: "/gestion/galeria",
      textoEnlace: "Gestionar galería",
    },
  ];

  return (
    <LayoutGestion
      seccionActiva="bitacora"
      titulo="Estado de la Asociación"
      descripcion="Resumen general del Centro de Gestión y acceso rápido a los principales módulos de trabajo."
    >
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {tarjetas.map((tarjeta) => (
          <article
            key={tarjeta.titulo}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-semibold text-slate-500">
              {tarjeta.titulo}
            </p>

            <p className="mt-3 text-4xl font-bold text-slate-900">
              {tarjeta.valor ?? "—"}
            </p>

            <p className="mt-3 text-sm text-slate-500">
              {tarjeta.valor === null
                ? "Datos no disponibles"
                : tarjeta.detalle}
            </p>

            <Link
              href={tarjeta.enlace}
              className="mt-5 inline-block text-sm font-semibold text-sky-700 hover:underline"
            >
              {tarjeta.textoEnlace} →
            </Link>
          </article>
        ))}

        <article className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <p className="text-sm font-semibold text-amber-800">
            Actividades
          </p>

          <p className="mt-3 text-2xl font-bold text-amber-900">
            En desarrollo
          </p>

          <p className="mt-3 text-sm text-amber-800">
            Pendiente de completar la gestión de actividades.
          </p>

          <Link
            href="/gestion/actividades"
            className="mt-5 inline-block text-sm font-semibold text-amber-900 hover:underline"
          >
            Ver módulo →
          </Link>
        </article>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900">
          Bitácora
        </h3>

        <p className="mt-3 leading-7 text-slate-600">
          Centro de Gestión de la Asociación Mar de San
          Ciprián. Desde este espacio se administran los
          socios, las noticias y la galería multimedia.
        </p>

        <p className="mt-3 leading-7 text-slate-600">
          Los indicadores se obtienen directamente de la
          base de datos. Los módulos de actividades,
          documentación y configuración continuarán
          desarrollándose progresivamente.
        </p>

        <p className="mt-5 text-sm text-slate-500">
          Sesión iniciada como: {user.email}
        </p>
      </section>
    </LayoutGestion>
  );
}
