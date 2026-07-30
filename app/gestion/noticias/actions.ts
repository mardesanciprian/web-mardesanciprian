"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function normalizarTexto(valor: FormDataEntryValue | null) {
  return typeof valor === "string" ? valor.trim() : "";
}

function crearSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function obtenerSlugDisponible(
  titulo: string,
  noticiaId?: number
) {
  const supabase = await createClient();
  const slugBase = crearSlug(titulo);

  if (!slugBase) {
    return null;
  }

  let slug = slugBase;
  let contador = 2;

  while (true) {
    let consulta = supabase
      .from("noticias")
      .select("id")
      .eq("slug", slug);

    if (noticiaId) {
      consulta = consulta.neq("id", noticiaId);
    }

    const { data, error } = await consulta.maybeSingle();

    if (error) {
      console.error("Error al comprobar el slug:", error);
      return null;
    }

    if (!data) {
      return slug;
    }

    slug = `${slugBase}-${contador}`;
    contador += 1;
  }
}

export async function crearNoticia(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/gestion");
  }

  const tituloGl = normalizarTexto(formData.get("titulo_gl"));
  const tituloEs = normalizarTexto(formData.get("titulo_es"));
  const resumenGl = normalizarTexto(formData.get("resumen_gl"));
  const resumenEs = normalizarTexto(formData.get("resumen_es"));
  const contenidoGl = normalizarTexto(formData.get("contenido_gl"));
  const contenidoEs = normalizarTexto(formData.get("contenido_es"));
  const imagenUrl = normalizarTexto(formData.get("imagen_url"));
  const imagenAltGl = normalizarTexto(formData.get("imagen_alt_gl"));
  const imagenAltEs = normalizarTexto(formData.get("imagen_alt_es"));
  const publicarAhora = formData.get("publicada") === "on";

  if (
    tituloGl.length < 3 ||
    tituloEs.length < 3 ||
    resumenGl.length < 10 ||
    resumenEs.length < 10 ||
    contenidoGl.length < 20 ||
    contenidoEs.length < 20
  ) {
    redirect("/gestion/noticias/nueva?error=validacion");
  }

  const slug = await obtenerSlugDisponible(tituloGl);

  if (!slug) {
    redirect("/gestion/noticias/nueva?error=slug");
  }

  const { error } = await supabase.from("noticias").insert({
    titulo_gl: tituloGl,
    titulo_es: tituloEs,
    resumen_gl: resumenGl,
    resumen_es: resumenEs,
    contenido_gl: contenidoGl,
    contenido_es: contenidoEs,
    slug,
    imagen_url: imagenUrl || null,
    imagen_alt_gl: imagenAltGl || null,
    imagen_alt_es: imagenAltEs || null,
    publicada: publicarAhora,
    fecha_publicacion: publicarAhora
      ? new Date().toISOString()
      : null,
    autor_id: user.id,
  });

  if (error) {
    console.error("Error al crear noticia:", error);
    redirect("/gestion/noticias/nueva?error=guardar");
  }

  revalidatePath("/gestion/noticias");
  revalidatePath("/gl/novas");
  revalidatePath("/es/noticias");

  redirect("/gestion/noticias?creada=1");
}

export async function editarNoticia(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/gestion");
  }

  const noticiaId = Number(formData.get("id"));

  if (!Number.isInteger(noticiaId) || noticiaId <= 0) {
    redirect("/gestion/noticias?error=id");
  }

  const tituloGl = normalizarTexto(formData.get("titulo_gl"));
  const tituloEs = normalizarTexto(formData.get("titulo_es"));
  const resumenGl = normalizarTexto(formData.get("resumen_gl"));
  const resumenEs = normalizarTexto(formData.get("resumen_es"));
  const contenidoGl = normalizarTexto(formData.get("contenido_gl"));
  const contenidoEs = normalizarTexto(formData.get("contenido_es"));
  const imagenUrl = normalizarTexto(formData.get("imagen_url"));
  const imagenAltGl = normalizarTexto(formData.get("imagen_alt_gl"));
  const imagenAltEs = normalizarTexto(formData.get("imagen_alt_es"));
  const publicarAhora = formData.get("publicada") === "on";

  const rutaEdicion = `/gestion/noticias/${noticiaId}/editar`;

  if (
    tituloGl.length < 3 ||
    tituloEs.length < 3 ||
    resumenGl.length < 10 ||
    resumenEs.length < 10 ||
    contenidoGl.length < 20 ||
    contenidoEs.length < 20
  ) {
    redirect(`${rutaEdicion}?error=validacion`);
  }

  const { data: noticiaActual, error: consultaError } = await supabase
    .from("noticias")
    .select("id, publicada, fecha_publicacion")
    .eq("id", noticiaId)
    .maybeSingle();

  if (consultaError) {
    console.error(
      "Error al consultar la noticia antes de editar:",
      consultaError
    );
    redirect(`${rutaEdicion}?error=consulta`);
  }

  if (!noticiaActual) {
    redirect("/gestion/noticias?error=no-encontrada");
  }

  const slug = await obtenerSlugDisponible(tituloGl, noticiaId);

  if (!slug) {
    redirect(`${rutaEdicion}?error=slug`);
  }

  let fechaPublicacion: string | null = null;

  if (publicarAhora) {
    fechaPublicacion =
      noticiaActual.publicada && noticiaActual.fecha_publicacion
        ? noticiaActual.fecha_publicacion
        : new Date().toISOString();
  }

  const { error } = await supabase
    .from("noticias")
    .update({
      titulo_gl: tituloGl,
      titulo_es: tituloEs,
      resumen_gl: resumenGl,
      resumen_es: resumenEs,
      contenido_gl: contenidoGl,
      contenido_es: contenidoEs,
      slug,
      imagen_url: imagenUrl || null,
      imagen_alt_gl: imagenAltGl || null,
      imagen_alt_es: imagenAltEs || null,
      publicada: publicarAhora,
      fecha_publicacion: fechaPublicacion,
    })
    .eq("id", noticiaId);

  if (error) {
    console.error("Error al editar noticia:", error);
    redirect(`${rutaEdicion}?error=guardar`);
  }

  revalidatePath("/gestion/noticias");
  revalidatePath(`/gestion/noticias/${noticiaId}`);
  revalidatePath(`/gestion/noticias/${noticiaId}/editar`);
  revalidatePath("/gl/novas");
  revalidatePath("/es/noticias");

  redirect(`/gestion/noticias/${noticiaId}?ok=1`);
}