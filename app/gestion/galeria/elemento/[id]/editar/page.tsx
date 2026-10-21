import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LayoutGestion from "@/components/gestion/LayoutGestion";

type EditarElementoPageProps = {
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
};

type Elemento = {
  id: number;
  album_id: number | null;
  tipo: "imagen" | "video";
  archivo_path: string;
  archivo_url: string;
  nombre_archivo: string;
  mime_type: string | null;
  titulo_gl: string | null;
  titulo_es: string | null;
  descripcion_gl: string | null;
  descripcion_es: string | null;
  alt_gl: string | null;
  alt_es: string | null;
  fecha_captura: string | null;
  autor_fotografia: string | null;
  publicado: boolean;
  destacado: boolean;
  orden: number;
};

function mensajeError(error?: string) {
  switch (error) {
    case "guardar":
      return "No se pudieron guardar los cambios.";
    case "consulta":
      return "No se pudo consultar el archivo.";
    default:
      return null;
  }
}

async function editarElemento(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/gestion");
  }

  const elementoId = Number(formData.get("id"));

  if (!Number.isInteger(elementoId) || elementoId <= 0) {
    redirect("/gestion/galeria");
  }

  const albumValor = String(formData.get("album_id") ?? "").trim();

  const albumId =
    albumValor && Number.isInteger(Number(albumValor))
      ? Number(albumValor)
      : null;

  const tituloGl = String(formData.get("titulo_gl") ?? "").trim();
  const tituloEs = String(formData.get("titulo_es") ?? "").trim();
  const descripcionGl = String(
    formData.get("descripcion_gl") ?? ""
  ).trim();
  const descripcionEs = String(
    formData.get("descripcion_es") ?? ""
  ).trim();
  const altGl = String(formData.get("alt_gl") ?? "").trim();
  const altEs = String(formData.get("alt_es") ?? "").trim();
  const autorFotografia = String(
    formData.get("autor_fotografia") ?? ""
  ).trim();
  const fechaCaptura = String(
    formData.get("fecha_captura") ?? ""
  ).trim();

  const publicado = formData.get("publicado") === "on";
  const destacado = formData.get("destacado") === "on";

  const ordenRaw = Number(formData.get("orden"));

  const orden =
    Number.isInteger(ordenRaw) && ordenRaw >= 0
      ? ordenRaw
      : 0;

  const { data: elementoActual, error: consultaError } = await supabase
    .from("galeria_elementos")
    .select("id, album_id")
    .eq("id", elementoId)
    .maybeSingle();

  if (consultaError) {
    console.error(
      "Error al consultar el archivo antes de editar:",
      consultaError
    );

    redirect(
      `/gestion/galeria/elemento/${elementoId}/editar?error=consulta`
    );
  }

  if (!elementoActual) {
    redirect("/gestion/galeria");
  }

  const { error } = await supabase
    .from("galeria_elementos")
    .update({
      album_id: albumId,
      titulo_gl: tituloGl || null,
      titulo_es: tituloEs || null,
      descripcion_gl: descripcionGl || null,
      descripcion_es: descripcionEs || null,
      alt_gl: altGl || null,
      alt_es: altEs || null,
      autor_fotografia: autorFotografia || null,
      fecha_captura: fechaCaptura || null,
      publicado,
      destacado,
      orden,
    })
    .eq("id", elementoId);

  if (error) {
    console.error("Error al editar el archivo:", error);

    redirect(
      `/gestion/galeria/elemento/${elementoId}/editar?error=guardar`
    );
  }

  const destino = albumId
    ? `/gestion/galeria/${albumId}?archivo=editado`
    : "/gestion/galeria?archivo=editado";

  redirect(destino);
}

export default async function EditarElementoPage({
  params,
  searchParams,
}: EditarElementoPageProps) {
  const { id } = await params;
  const { error } = await searchParams;

  const elementoId = Number(id);

  if (!Number.isInteger(elementoId) || elementoId <= 0) {
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
    .from("galeria_elementos")
    .select(
      `
        id,
        album_id,
        tipo,
        archivo_path,
        archivo_url,
        nombre_archivo,
        mime_type,
        titulo_gl,
        titulo_es,
        descripcion_gl,
        descripcion_es,
        alt_gl,
        alt_es,
        fecha_captura,
        autor_fotografia,
        publicado,
        destacado,
        orden
      `
    )
    .eq("id", elementoId)
    .maybeSingle();

  if (consultaError) {
    console.error("Error al consultar el archivo:", consultaError);
  }

  if (!data) {
    notFound();
  }

  const elemento = data as Elemento;

  const { data: albumesData, error: albumesError } = await supabase
    .from("galeria_albumes")
    .select("id, titulo_gl, titulo_es")
    .order("titulo_gl", { ascending: true });

  if (albumesError) {
    console.error("Error al consultar los álbumes:", albumesError);
  }

  const albumes = (albumesData ?? []) as Album[];
  const avisoError = mensajeError(error);

  const volverA = elemento.album_id
    ? `/gestion/galeria/${elemento.album_id}`
    : "/gestion/galeria";

  return (
    <LayoutGestion
      seccionActiva="galeria"
      titulo="Editar archivo"
      descripcion="Modifica la información, organización y publicación del elemento multimedia."
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
          href={volverA}
          className="text-sm font-semibold text-sky-700 hover:underline"
        >
          ← Volver
        </Link>
      </div>

      <form action={editarElemento} className="space-y-6">
        <input type="hidden" name="id" value={elemento.id} />

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="aspect-video bg-slate-900">
            {elemento.tipo === "imagen" ? (
              <img
                src={elemento.archivo_url}
                alt={
                  elemento.alt_gl ||
                  elemento.alt_es ||
                  elemento.titulo_gl ||
                  elemento.titulo_es ||
                  elemento.nombre_archivo
                }
                className="h-full w-full object-contain"
              />
            ) : (
              <video
                src={elemento.archivo_url}
                controls
                preload="metadata"
                className="h-full w-full object-contain"
              />
            )}
          </div>

          <div className="p-6">
            <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  Tipo
                </dt>

                <dd className="mt-1 text-slate-900">
                  {elemento.tipo === "imagen"
                    ? "Fotografía"
                    : "Vídeo"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  Nombre original
                </dt>

                <dd className="mt-1 break-all text-slate-900">
                  {elemento.nombre_archivo}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  Formato
                </dt>

                <dd className="mt-1 text-slate-900">
                  {elemento.mime_type || "No identificado"}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Organización
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="album_id"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Álbum
              </label>

              <select
                id="album_id"
                name="album_id"
                defaultValue={
                  elemento.album_id
                    ? String(elemento.album_id)
                    : ""
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
              >
                <option value="">Sin álbum</option>

                {albumes.map((album) => (
                  <option
                    key={album.id}
                    value={album.id}
                  >
                    {album.titulo_gl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="orden"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Orden
              </label>

              <input
                id="orden"
                name="orden"
                type="number"
                min={0}
                step={1}
                defaultValue={elemento.orden}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Información
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
                maxLength={200}
                defaultValue={elemento.titulo_gl ?? ""}
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
                maxLength={200}
                defaultValue={elemento.titulo_es ?? ""}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div>
              <label
                htmlFor="descripcion_gl"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Descripción en gallego
              </label>

              <textarea
                id="descripcion_gl"
                name="descripcion_gl"
                rows={5}
                defaultValue={elemento.descripcion_gl ?? ""}
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
                rows={5}
                defaultValue={elemento.descripcion_es ?? ""}
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>
        </section>

        {elemento.tipo === "imagen" && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Información fotográfica
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="autor_fotografia"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Autor de la fotografía
                </label>

                <input
                  id="autor_fotografia"
                  name="autor_fotografia"
                  type="text"
                  maxLength={200}
                  defaultValue={
                    elemento.autor_fotografia ?? ""
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label
                  htmlFor="fecha_captura"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Fecha de la fotografía
                </label>

                <input
                  id="fecha_captura"
                  name="fecha_captura"
                  type="date"
                  defaultValue={
                    elemento.fecha_captura ?? ""
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label
                  htmlFor="alt_gl"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Texto alternativo en gallego
                </label>

                <input
                  id="alt_gl"
                  name="alt_gl"
                  type="text"
                  maxLength={250}
                  defaultValue={elemento.alt_gl ?? ""}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label
                  htmlFor="alt_es"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Texto alternativo en castellano
                </label>

                <input
                  id="alt_es"
                  name="alt_es"
                  type="text"
                  maxLength={250}
                  defaultValue={elemento.alt_es ?? ""}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>
          </section>
        )}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Publicación
          </h2>

          <div className="mt-6 space-y-5">
            <label className="flex cursor-pointer items-start gap-4">
              <input
                name="publicado"
                type="checkbox"
                defaultChecked={elemento.publicado}
                className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-700 focus:ring-sky-600"
              />

              <span>
                <span className="block font-semibold text-slate-900">
                  Publicar archivo
                </span>

                <span className="mt-1 block text-sm leading-6 text-slate-600">
                  Si está marcado, podrá mostrarse en la galería pública.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-4">
              <input
                name="destacado"
                type="checkbox"
                defaultChecked={elemento.destacado}
                className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-700 focus:ring-sky-600"
              />

              <span>
                <span className="block font-semibold text-slate-900">
                  Archivo destacado
                </span>

                <span className="mt-1 block text-sm leading-6 text-slate-600">
                  Permitirá resaltar esta fotografía o vídeo en futuras vistas.
                </span>
              </span>
            </label>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href={volverA}
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