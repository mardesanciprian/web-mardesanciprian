import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ModuloEnDesarrollo from "@/components/gestion/ModuloEnDesarrollo";

export default async function GaleriaGestionPage() {
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
      seccion="galeria"
      titulo="Galería"
      descripcion="Gestión de fotografías, vídeos y colecciones multimedia de la Asociación."
    />
  );
}