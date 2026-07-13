import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ModuloEnDesarrollo from "@/components/gestion/ModuloEnDesarrollo";

export default async function NoticiasGestionPage() {
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
      seccion="noticias"
      titulo="Noticias"
      descripcion="Publicación y gestión de las noticias de la Asociación Mar de San Ciprián."
    />
  );
}