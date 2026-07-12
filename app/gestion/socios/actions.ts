"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function obtenerTexto(formData: FormData, campo: string): string {
  return String(formData.get(campo) ?? "").trim();
}

function obtenerTextoOpcional(
  formData: FormData,
  campo: string
): string | null {
  const valor = obtenerTexto(formData, campo);
  return valor || null;
}

export async function crearSocio(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/gestion");
  }

  const nombre = obtenerTexto(formData, "nombre");
  const apellidos = obtenerTexto(formData, "apellidos");
  const email = obtenerTexto(formData, "email").toLowerCase();
  const localidad = obtenerTexto(formData, "localidad");
  const provincia = obtenerTexto(formData, "provincia");

  if (
    nombre.length < 2 ||
    apellidos.length < 2 ||
    localidad.length < 2 ||
    provincia.length < 2
  ) {
    redirect(
      "/gestion/socios/nuevo?error=" +
        encodeURIComponent("Completa correctamente los campos obligatorios.")
    );
  }

  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formatoEmail.test(email)) {
    redirect(
      "/gestion/socios/nuevo?error=" +
        encodeURIComponent("El correo electrónico no es válido.")
    );
  }

  const dniNie = obtenerTextoOpcional(formData, "dni_nie");

  const { error } = await supabase.from("socios").insert({
    nombre,
    apellidos,
    email,
    telefono: obtenerTextoOpcional(formData, "telefono"),
    dni_nie: dniNie ? dniNie.toUpperCase() : null,
    fecha_nacimiento: obtenerTextoOpcional(
      formData,
      "fecha_nacimiento"
    ),
    direccion: obtenerTextoOpcional(formData, "direccion"),
    codigo_postal: obtenerTextoOpcional(
      formData,
      "codigo_postal"
    ),
    localidad,
    provincia,
    pais: obtenerTexto(formData, "pais") || "España",
    acepta_privacidad: true,
  });

  if (error) {
    console.error("Error al crear socio desde gestión:", error);

    const mensaje =
      error.code === "23505"
        ? "Ya existe una persona inscrita con ese correo o DNI/NIE."
        : "No se pudo registrar el socio.";

    redirect(
      "/gestion/socios/nuevo?error=" +
        encodeURIComponent(mensaje)
    );
  }

  redirect("/gestion/socios?creado=1");
}