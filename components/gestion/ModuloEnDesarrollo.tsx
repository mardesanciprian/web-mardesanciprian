import LayoutGestion from "@/components/gestion/LayoutGestion";

type Seccion =
  | "bitacora"
  | "socios"
  | "noticias"
  | "galeria"
  | "actividades"
  | "documentacion"
  | "configuracion";

type Props = {
  seccion: Seccion;
  titulo: string;
  descripcion: string;
};

export default function ModuloEnDesarrollo({
  seccion,
  titulo,
  descripcion,
}: Props) {
  return (
    <LayoutGestion
      seccionActiva={seccion}
      titulo={titulo}
      descripcion={descripcion}
    >
      <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">

        <div className="mx-auto max-w-3xl text-center">

          <div className="text-6xl">
            🚧
          </div>

          <h3 className="mt-6 text-3xl font-bold text-slate-900">
            Módulo en desarrollo
          </h3>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Este módulo forma parte del nuevo Centro de Gestión de la
            Asociación Mar de San Ciprián.
          </p>

          <p className="mt-4 leading-8 text-slate-600">
            Actualmente estamos finalizando su desarrollo para mantener la
            misma calidad que el resto de la plataforma.
          </p>

        </div>

      </section>
    </LayoutGestion>
  );
}