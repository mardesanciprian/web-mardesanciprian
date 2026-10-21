
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function obtenerTexto(formData: FormData, campo: string) {
  const valor = formData.get(campo);
  return typeof valor === "string" ? valor.trim() : "";
}

function convertirFecha(valor: string) {
  if (!valor) return null;

  const fecha = new Date(valor);

  return Number.isNaN(fecha.getTime())
    ? null
    : fecha.toISOString();
}

function imagenValida(valor: string) {
  if (!valor) return true;

  try {
    const url = new URL(valor);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

async function obtenerSupabaseAdministrador() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/gestion");
  }

  const { data: administrador, error: adminError } =
    await supabase
      .from("administradores")
      .select("usuario_id")
      .eq("usuario_id", user.id)
      .maybeSingle();

  if (adminError || !administrador) {
    redirect("/gestion");
  }

  return supabase;
}

function leerActividad(formData: FormData) {
  const titulo_gl = obtenerTexto(formData, "titulo_gl");
  const titulo_es = obtenerTexto(formData, "titulo_es");

  const descripcion_gl = obtenerTexto(formData, "descripcion_gl");
  const descripcion_es = obtenerTexto(formData, "descripcion_es");

  const fecha_inicio = obtenerTexto(formData, "fecha_inicio");
  const fecha_fin = obtenerTexto(formData, "fecha_fin");

  const lugar = obtenerTexto(formData, "lugar");
  const categoria = obtenerTexto(formData, "categoria");
  const imagen_url = obtenerTexto(formData, "imagen_url");

  const inicio = convertirFecha(fecha_inicio);
  const fin = convertirFecha(fecha_fin);

  const estado =
    formData.get("publicada") === "on"
      ? "publicada"
      : "borrador";

  let error: string | null = null;

  if (
    titulo_gl.length < 3 ||
    titulo_gl.length > 200 ||
    titulo_es.length < 3 ||
    titulo_es.length > 200
  ) {
    error = "validacion";
  } else if (
    (fecha_inicio && !inicio) ||
    (fecha_fin && !fin) ||
    (inicio && fin && new Date(fin) < new Date(inicio))
  ) {
    error = "fechas";
  } else if (!imagenValida(imagen_url)) {
    error = "imagen";
  }

  return {
    error,
    datos: {
      titulo_gl,
      titulo_es,
      descripcion_gl: descripcion_gl || null,
      descripcion_es: descripcion_es || null,
      fecha_inicio: inicio,
      fecha_fin: fin,
      lugar: lugar || null,
      categoria: categoria || null,
      imagen_url: imagen_url || null,
      estado,
    },
  };
}

// CREAR UNA ACTIVIDAD

export async function crearActividad(formData: FormData) {
  const supabase = await obtenerSupabaseAdministrador();

  const { error, datos } = leerActividad(formData);

  if (error) {
    redirect(`/gestion/actividades/nueva?error=${error}`);
  }

  const { error: guardarError } = await supabase
    .from("actividades")
    .insert(datos);

  if (guardarError) {
    console.error("Error al crear actividad:", guardarError);
    redirect("/gestion/actividades/nueva?error=guardar");
  }

  redirect("/gestion/actividades?creada=1");
}

// ACTUALIZAR UNA ACTIVIDAD EXISTENTE

export async function actualizarActividad(formData: FormData) {
  const supabase = await obtenerSupabaseAdministrador();

  const id = obtenerTexto(formData, "id");

  // Validar el identificador UUID
  const uuidValido =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      id
    );

  if (!uuidValido) {
    redirect("/gestion/actividades");
  }

  const { error, datos } = leerActividad(formData);

  if (error) {
    redirect(
      `/gestion/actividades/${id}/editar?error=${error}`
    );
  }

  const { data: actividadActualizada, error: guardarError } =
    await supabase
      .from("actividades")
      .update({
        ...datos,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id")
      .maybeSingle();

  if (guardarError || !actividadActualizada) {
    console.error("Error al actualizar actividad:", guardarError);

    redirect(
      `/gestion/actividades/${id}/editar?error=guardar`
    );
  }

  redirect("/gestion/actividades?actualizada=1");
}
