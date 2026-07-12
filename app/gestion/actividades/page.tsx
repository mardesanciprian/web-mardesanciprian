import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ModuloEnDesarrollo from "@/components/gestion/ModuloEnDesarrollo";

export default async function ActividadesGestionPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/gestion");
  }

  return (
    <ModuloEnDesarrollo
      seccion="actividades"
      titulo="Actividades"
      descripcion="Planificación y publicación de actividades, encuentros y eventos de la Asociación."
    />
  );
}