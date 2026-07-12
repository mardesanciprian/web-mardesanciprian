"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function texto(formData: FormData, campo: string) {
  return String(formData.get(campo) ?? "").trim();
}

function opcional(formData: FormData, campo: string) {
  const valor = texto(formData, campo);
  return valor === "" ? null : valor;
}

export async function actualizarSocio(
  id: number,
  formData: FormData
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/gestion");
  }

  const { error } = await supabase
    .from("socios")
    .update({
      nombre: texto(formData, "nombre"),
      apellidos: texto(formData, "apellidos"),
      email: texto(formData, "email").toLowerCase(),
      telefono: opcional(formData, "telefono"),
      dni_nie: opcional(formData, "dni_nie"),
      direccion: opcional(formData, "direccion"),
      codigo_postal: opcional(formData, "codigo_postal"),
      localidad: texto(formData, "localidad"),
      provincia: texto(formData, "provincia"),
      pais: texto(formData, "pais"),
      fecha_nacimiento: opcional(
        formData,
        "fecha_nacimiento"
      ),
    })
    .eq("id", id);

  if (error) {
    console.error(error);

    redirect(
      `/gestion/socios/${id}?error=1`
    );
  }

  redirect(`/gestion/socios/${id}?ok=1`);
}