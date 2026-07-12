import Link from "next/link";
import type { ReactNode } from "react";
import { cerrarSesion } from "@/app/gestion/actions";

type SeccionGestion =
  | "bitacora"
  | "socios"
  | "noticias"
  | "galeria"
  | "actividades"
  | "documentacion"
  | "configuracion";

type LayoutGestionProps = {
  children: ReactNode;
  seccionActiva: SeccionGestion;
  titulo: string;
  descripcion?: string;
};

const enlaces: Array<{
  id: SeccionGestion;
  nombre: string;
  href: string;
}> = [
  {
    id: "bitacora",
    nombre: "Bitácora",
    href: "/gestion/bitacora",
  },
  {
    id: "socios",
    nombre: "Socios",
    href: "/gestion/socios",
  },
  {
    id: "noticias",
    nombre: "Noticias",
    href: "/gestion/noticias",
  },
  {
    id: "galeria",
    nombre: "Galería",
    href: "/gestion/galeria",
  },
  {
    id: "actividades",
    nombre: "Actividades",
    href: "/gestion/actividades",
  },
  {
    id: "documentacion",
    nombre: "Documentación",
    href: "/gestion/documentacion",
  },
  {
    id: "configuracion",
    nombre: "Configuración",
    href: "/gestion/configuracion",
  },
];

export default function LayoutGestion({
  children,
  seccionActiva,
  titulo,
  descripcion,
}: LayoutGestionProps) {
  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
              Mar de San Ciprián
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Centro de Gestión
            </h1>
          </div>

          <form action={cerrarSesion}>
            <button
              type="submit"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] gap-8 px-6 py-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <nav aria-label="Navegación del Centro de Gestión">
            <ul className="space-y-1">
              {enlaces.map((enlace) => {
                const activo = enlace.id === seccionActiva;

                return (
                  <li key={enlace.id}>
                    <Link
                      href={enlace.href}
                      aria-current={activo ? "page" : undefined}
                      className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        activo
                          ? "bg-slate-900 text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {enlace.nombre}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <section className="min-w-0">
          <header className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
              {enlaces.find((enlace) => enlace.id === seccionActiva)?.nombre}
            </p>

            <h2 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
              {titulo}
            </h2>

            {descripcion && (
              <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                {descripcion}
              </p>
            )}
          </header>

          {children}
        </section>
      </div>
    </main>
  );
}