import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ModuloEnDesarrollo from "@/components/gestion/ModuloEnDesarrollo";

export default async function DocumentacionGestionPage() {
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
      seccion="documentacion"
      titulo="Documentación"
      descripcion="Archivo interno de documentos, actas, publicaciones y materiales históricos."
    />
  );
}