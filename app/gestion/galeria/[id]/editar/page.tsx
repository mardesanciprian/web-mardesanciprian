import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LayoutGestion from "@/components/gestion/LayoutGestion";

type EditarAlbumPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

type Album = {
  id: number;
  titulo_gl: string;
  titulo_es: string;
  descripcion_gl: string | null;
  descripcion_es: string | null;
  slug: string;
  portada_url: string | null;
  fecha_evento: string | null;
  publicado: boolean;
  destacado: boolean;
};

function crearSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mensajeError(error?: string) {
  switch (error) {
    case "validacion":
      return "Revisa los campos obligatorios del álbum.";
    case "slug":
      return "No se pudo generar una dirección válida para el álbum.";
    case "guardar":
      return "No se pudieron guardar los cambios.";
    default:
      return null;
  }
}

async function editarAlbum(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/gestion");
  }

  const albumId = Number(formData.get("id"));

  if (!Number.isInteger(albumId) || albumId <= 0) {
    redirect("/gestion/galeria");
  }

  const tituloGl = String(formData.get("titulo_gl") ?? "").trim();
  const tituloEs = String(formData.get("titulo_es") ?? "").trim();
  const descripcionGl = String(
    formData.get("descripcion_gl") ?? ""
  ).trim();
  const descripcionEs = String(
    formData.get("descripcion_es") ?? ""
  ).trim();
  const fechaEvento = String(formData.get("fecha_evento") ?? "").trim();
  const publicado = formData.get("publicado") === "on";
  const destacado = formData.get("destacado") === "on";

  const rutaEdicion = `/gestion/galeria/${albumId}/editar`;

  if (tituloGl.length < 2 || tituloEs.length < 2) {
    redirect(`${rutaEdicion}?error=validacion`);
  }

  const slugBase = crearSlug(tituloGl);

  if (!slugBase) {
    redirect(`${rutaEdicion}?error=slug`);
  }

  let slug = slugBase;
  let contador = 2;

  while (true) {
    const { data, error } = await supabase
      .from("galeria_albumes")
      .select("id")
      .eq("slug", slug)
      .neq("id", albumId)
      .maybeSingle();

    if (error) {
      console.error("Error al comprobar slug del álbum:", error);
      redirect(`${rutaEdicion}?error=guardar`);
    }

    if (!data) {
      break;
    }

    slug = `${slugBase}-${contador}`;
    contador += 1;
  }

  const { error } = await supabase
    .from("galeria_albumes")
    .update({
      titulo_gl: tituloGl,
      titulo_es: tituloEs,
      descripcion_gl: descripcionGl || null,
      descripcion_es: descripcionEs || null,
      fecha_evento: fechaEvento || null,
      slug,
      publicado,
      destacado,
    })
    .eq("id", albumId);

  if (error) {
    console.error("Error al editar álbum:", error);
    redirect(`${rutaEdicion}?error=guardar`);
  }

  redirect(`/gestion/galeria/${albumId}?ok=1`);
}

export default async function EditarAlbumPage({
  params,
  searchParams,
}: EditarAlbumPageProps) {
  const { id } = await params;
  const { error } = await searchParams;

  const albumId = Number(id);

  if (!Number.isInteger(albumId) || albumId <= 0) {
    notFound();
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/gestion");
  }

  const { data, error: consultaError } = await supabase
    .from("galeria_albumes")
    .select(
      `
        id,
        titulo_gl,
        titulo_es,
        descripcion_gl,
        descripcion_es,
        slug,
        portada_url,
        fecha_evento,
        publicado,
        destacado
      `
    )
    .eq("id", albumId)
    .maybeSingle();

  if (consultaError) {
    console.error("Error al consultar el álbum:", consultaError);
  }

  if (!data) {
    notFound();
  }

  const album = data as Album;
  const avisoError = mensajeError(error);

  return (
    <LayoutGestion
      seccionActiva="galeria"
      titulo="Editar álbum"
      descripcion={`Modifica la colección “${album.titulo_gl}”.`}
    >
      {avisoError && (
        <div
          role="alert"
          className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-800"
        >
          {avisoError}
        </div>
      )}

      <div className="mb-6">
        <Link
          href={`/gestion/galeria/${album.id}`}
          className="text-sm font-semibold text-sky-700 hover:underline"
        >
          ← Volver al álbum
        </Link>
      </div>

      <form action={editarAlbum} className="space-y-6">
        <input type="hidden" name="id" value={album.id} />

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Información principal
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="titulo_gl"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Título en gallego
              </label>

              <input
                id="titulo_gl"
                name="titulo_gl"
                type="text"
                required
                minLength={2}
                maxLength={200}
                defaultValue={album.titulo_gl}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div>
              <label
                htmlFor="titulo_es"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Título en castellano
              </label>

              <input
                id="titulo_es"
                name="titulo_es"
                type="text"
                required
                minLength={2}
                maxLength={200}
                defaultValue={album.titulo_es}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div>
              <label
                htmlFor="descripcion_gl"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Descrición en galego
              </label>

              <textarea
                id="descripcion_gl"
                name="descripcion_gl"
                rows={6}
                defaultValue={album.descripcion_gl ?? ""}
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div>
              <label
                htmlFor="descripcion_es"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Descripción en castellano
              </label>

              <textarea
                id="descripcion_es"
                name="descripcion_es"
                rows={6}
                defaultValue={album.descripcion_es ?? ""}
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div>
              <label
                htmlFor="fecha_evento"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Fecha del evento
              </label>

              <input
                id="fecha_evento"
                name="fecha_evento"
                type="date"
                defaultValue={album.fecha_evento ?? ""}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Publicación
          </h2>

          <div className="mt-6 space-y-5">
            <label className="flex cursor-pointer items-start gap-4">
              <input
                name="publicado"
                type="checkbox"
                defaultChecked={album.publicado}
                className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-700 focus:ring-sky-600"
              />

              <span>
                <span className="block font-semibold text-slate-900">
                  Publicar álbum
                </span>

                <span className="mt-1 block text-sm leading-6 text-slate-600">
                  Si está marcado, el álbum podrá mostrarse en la galería pública.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-4">
              <input
                name="destacado"
                type="checkbox"
                defaultChecked={album.destacado}
                className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-700 focus:ring-sky-600"
              />

              <span>
                <span className="block font-semibold text-slate-900">
                  Álbum destacado
                </span>

                <span className="mt-1 block text-sm leading-6 text-slate-600">
                  Permitirá destacar esta colección en futuras vistas públicas.
                </span>
              </span>
            </label>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href={`/gestion/galeria/${album.id}`}
            className="rounded-xl border border-slate-300 px-7 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-7 py-3 font-semibold text-white transition hover:bg-sky-800"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </LayoutGestion>
  );
}