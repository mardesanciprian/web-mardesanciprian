import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ModuloEnDesarrollo from "@/components/gestion/ModuloEnDesarrollo";

export default async function ConfiguracionGestionPage() {
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
      seccion="configuracion"
      titulo="Configuración"
      descripcion="Ajustes generales y opciones internas del Centro de Gestión."
    />
  );
}