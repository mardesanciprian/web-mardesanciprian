import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LayoutGestion from "@/components/gestion/LayoutGestion";

type NuevoAlbumPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

function mensajeError(error?: string) {
  switch (error) {
    case "validacion":
      return "Revisa los campos obligatorios del álbum.";
    case "slug":
      return "No se pudo generar una dirección válida para el álbum.";
    case "guardar":
      return "No se pudo guardar el álbum. Inténtalo de nuevo.";
    default:
      return null;
  }
}

function crearSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function crearAlbum(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/gestion");
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

  if (tituloGl.length < 2 || tituloEs.length < 2) {
    redirect("/gestion/galeria/nuevo-album?error=validacion");
  }

  const slugBase = crearSlug(tituloGl);

  if (!slugBase) {
    redirect("/gestion/galeria/nuevo-album?error=slug");
  }

  let slug = slugBase;
  let contador = 2;

  while (true) {
    const { data, error } = await supabase
      .from("galeria_albumes")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("Error al comprobar slug del álbum:", error);
      redirect("/gestion/galeria/nuevo-album?error=guardar");
    }

    if (!data) {
      break;
    }

    slug = `${slugBase}-${contador}`;
    contador += 1;
  }

  const { error } = await supabase.from("galeria_albumes").insert({
    titulo_gl: tituloGl,
    titulo_es: tituloEs,
    descripcion_gl: descripcionGl || null,
    descripcion_es: descripcionEs || null,
    slug,
    portada_url: null,
    fecha_evento: fechaEvento || null,
    publicado,
    destacado,
    orden: 0,
    autor_id: user.id,
  });

  if (error) {
    console.error("Error al crear álbum:", error);
    redirect("/gestion/galeria/nuevo-album?error=guardar");
  }

  redirect("/gestion/galeria?album=creado");
}

export default async function NuevoAlbumPage({
  searchParams,
}: NuevoAlbumPageProps) {
  const { error } = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/gestion");
  }

  const avisoError = mensajeError(error);

  return (
    <LayoutGestion
      seccionActiva="galeria"
      titulo="Nuevo álbum"
      descripcion="Crea una colección para organizar fotografías y vídeos."
    >
      {avisoError && (
        <div
          role="alert"
          className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-800"
        >
          {avisoError}
        </div>
      )}

      <form action={crearAlbum} className="space-y-6">
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
                placeholder="Ex.: Maruxaina 2026"
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
                placeholder="Ej.: Maruxaina 2026"
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
                rows={5}
                placeholder="Descrición do álbum"
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
                placeholder="Descripción del álbum"
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
                className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-700 focus:ring-sky-600"
              />

              <span>
                <span className="block font-semibold text-slate-900">
                  Publicar álbum
                </span>

                <span className="mt-1 block text-sm leading-6 text-slate-600">
                  Si no marcas esta opción, el álbum quedará como borrador.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-4">
              <input
                name="destacado"
                type="checkbox"
                className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-700 focus:ring-sky-600"
              />

              <span>
                <span className="block font-semibold text-slate-900">
                  Álbum destacado
                </span>

                <span className="mt-1 block text-sm leading-6 text-slate-600">
                  Podrá utilizarse más adelante para destacar esta colección
                  en la página principal o en la galería pública.
                </span>
              </span>
            </label>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/gestion/galeria"
            className="rounded-xl border border-slate-300 px-7 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-7 py-3 font-semibold text-white transition hover:bg-sky-800"
          >
            Crear álbum
          </button>
        </div>
      </form>
    </LayoutGestion>
  );
}