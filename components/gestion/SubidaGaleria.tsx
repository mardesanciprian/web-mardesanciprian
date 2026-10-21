"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Album = {
  id: number;
  titulo_gl: string;
  titulo_es: string;
};

type SubidaGaleriaProps = {
  albumes?: Album[];
};

type EstadoSubida = "reposo" | "subiendo" | "correcto" | "error";

function limpiarNombreArchivo(nombre: string) {
  const partes = nombre.split(".");
  const extension =
    partes.length > 1 ? partes.pop()?.toLowerCase() ?? "" : "";

  const nombreBase = partes
    .join(".")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);

  return extension
    ? `${nombreBase || "archivo"}.${extension}`
    : nombreBase || "archivo";
}

function detectarTipo(mimeType: string) {
  if (mimeType.startsWith("image/")) {
    return "imagen";
  }

  if (mimeType.startsWith("video/")) {
    return "video";
  }

  return null;
}

function mostrarTamano(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function SubidaGaleria({
  albumes = [],
}: SubidaGaleriaProps) {
  const router = useRouter();

  const [archivo, setArchivo] = useState<File | null>(null);
  const [albumId, setAlbumId] = useState<string>("");

  const [tituloGl, setTituloGl] = useState("");
  const [tituloEs, setTituloEs] = useState("");
  const [descripcionGl, setDescripcionGl] = useState("");
  const [descripcionEs, setDescripcionEs] = useState("");
  const [altGl, setAltGl] = useState("");
  const [altEs, setAltEs] = useState("");
  const [autorFotografia, setAutorFotografia] = useState("");
  const [fechaCaptura, setFechaCaptura] = useState("");
  const [publicado, setPublicado] = useState(false);

  const [estado, setEstado] = useState<EstadoSubida>("reposo");
  const [mensaje, setMensaje] = useState("");
  const [progreso, setProgreso] = useState(0);

  const vistaPrevia = useMemo(() => {
    if (!archivo) {
      return null;
    }

    return URL.createObjectURL(archivo);
  }, [archivo]);

  function seleccionarArchivo(event: ChangeEvent<HTMLInputElement>) {
    const seleccionado = event.target.files?.[0] ?? null;

    setEstado("reposo");
    setMensaje("");
    setProgreso(0);

    if (!seleccionado) {
      setArchivo(null);
      return;
    }

    const tipo = detectarTipo(seleccionado.type);

    if (!tipo) {
      setArchivo(null);
      setEstado("error");
      setMensaje(
        "El archivo seleccionado no es una imagen ni un vídeo compatible."
      );
      event.target.value = "";
      return;
    }

    setArchivo(seleccionado);
  }

  async function subirArchivo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!archivo) {
      setEstado("error");
      setMensaje("Selecciona una fotografía o un vídeo.");
      return;
    }

    const tipo = detectarTipo(archivo.type);

    if (!tipo) {
      setEstado("error");
      setMensaje("Tipo de archivo no permitido.");
      return;
    }

    setEstado("subiendo");
    setMensaje("Preparando la subida...");
    setProgreso(10);

    const supabase = createClient();

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setEstado("error");
        setMensaje(
          "La sesión del Centro de Gestión ha caducado. Inicia sesión de nuevo."
        );
        return;
      }

      setProgreso(20);

      const ahora = new Date();

      const carpetaFecha = [
        ahora.getFullYear(),
        String(ahora.getMonth() + 1).padStart(2, "0"),
      ].join("/");

      const identificador =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

      const nombreLimpio = limpiarNombreArchivo(archivo.name);

      const albumNumerico =
        albumId && Number.isInteger(Number(albumId))
          ? Number(albumId)
          : null;

      const archivoPath = albumNumerico
        ? `albumes/${albumNumerico}/${carpetaFecha}/${identificador}-${nombreLimpio}`
        : `sin-album/${carpetaFecha}/${identificador}-${nombreLimpio}`;

      setMensaje("Subiendo archivo a la biblioteca...");
      setProgreso(40);

      const { error: storageError } = await supabase.storage
        .from("galeria")
        .upload(archivoPath, archivo, {
          cacheControl: "3600",
          upsert: false,
          contentType: archivo.type,
        });

      if (storageError) {
        console.error("Error al subir archivo:", storageError);

        setEstado("error");
        setMensaje(
          `No se pudo subir el archivo: ${storageError.message}`
        );
        return;
      }

      setProgreso(70);

      const { data: urlData } = supabase.storage
        .from("galeria")
        .getPublicUrl(archivoPath);

      const archivoUrl = urlData.publicUrl;

      setMensaje("Registrando información del archivo...");

      const { error: databaseError } = await supabase
        .from("galeria_elementos")
        .insert({
          album_id: albumNumerico,
          tipo,
          archivo_path: archivoPath,
          archivo_url: archivoUrl,
          nombre_archivo: archivo.name,
          mime_type: archivo.type || null,
          tamano_bytes: archivo.size,
          titulo_gl: tituloGl.trim() || null,
          titulo_es: tituloEs.trim() || null,
          descripcion_gl: descripcionGl.trim() || null,
          descripcion_es: descripcionEs.trim() || null,
          alt_gl: altGl.trim() || null,
          alt_es: altEs.trim() || null,
          fecha_captura: fechaCaptura || null,
          autor_fotografia: autorFotografia.trim() || null,
          publicado,
          destacado: false,
          orden: 0,
          usuario_id: user.id,
        });

      if (databaseError) {
        console.error(
          "Error al registrar el archivo en la base de datos:",
          databaseError
        );

        await supabase.storage.from("galeria").remove([archivoPath]);

        setEstado("error");
        setMensaje(
          `El archivo se subió, pero no pudo registrarse. La subida se ha revertido: ${databaseError.message}`
        );
        return;
      }

      setProgreso(100);
      setEstado("correcto");
      setMensaje(
        tipo === "imagen"
          ? "La fotografía se ha añadido correctamente a la galería."
          : "El vídeo se ha añadido correctamente a la galería."
      );

      setArchivo(null);
      setAlbumId("");
      setTituloGl("");
      setTituloEs("");
      setDescripcionGl("");
      setDescripcionEs("");
      setAltGl("");
      setAltEs("");
      setAutorFotografia("");
      setFechaCaptura("");
      setPublicado(false);

      const inputArchivo = document.getElementById(
        "archivo-galeria"
      ) as HTMLInputElement | null;

      if (inputArchivo) {
        inputArchivo.value = "";
      }

      router.refresh();
    } catch (error) {
      console.error("Error inesperado durante la subida:", error);

      setEstado("error");
      setMensaje(
        "Se produjo un error inesperado durante la subida del archivo."
      );
    }
  }

  const tipoArchivo = archivo ? detectarTipo(archivo.type) : null;

  return (
    <form onSubmit={subirArchivo} className="space-y-6">
      {mensaje && (
        <div
          role={estado === "error" ? "alert" : "status"}
          className={`rounded-2xl border px-5 py-4 text-sm font-semibold ${
            estado === "error"
              ? "border-red-200 bg-red-50 text-red-800"
              : estado === "correcto"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-sky-200 bg-sky-50 text-sky-800"
          }`}
        >
          {mensaje}
        </div>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Archivo multimedia
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Selecciona una fotografía o un vídeo de tu ordenador.
          </p>
        </div>

        <div className="mt-6">
          <label
            htmlFor="album_id"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Álbum
          </label>

          <select
            id="album_id"
            value={albumId}
            onChange={(event) => setAlbumId(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
          >
            <option value="">Sin álbum</option>

            {albumes.map((album) => (
              <option key={album.id} value={album.id}>
                {album.titulo_gl}
              </option>
            ))}
          </select>

          <p className="mt-2 text-xs text-slate-500">
            Puedes dejar el archivo sin álbum y organizarlo más adelante.
          </p>
        </div>

        <div className="mt-6">
          <label
            htmlFor="archivo-galeria"
            className="block cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-sky-500 hover:bg-sky-50"
          >
            <span className="block text-lg font-bold text-slate-900">
              Seleccionar archivo
            </span>

            <span className="mt-2 block text-sm text-slate-500">
              Fotografías y vídeos
            </span>
          </label>

          <input
            id="archivo-galeria"
            type="file"
            accept="image/*,video/*"
            onChange={seleccionarArchivo}
            className="sr-only"
          />
        </div>

        {archivo && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
              <div className="overflow-hidden rounded-2xl bg-slate-900">
                {tipoArchivo === "imagen" && vistaPrevia && (
                  <img
                    src={vistaPrevia}
                    alt="Vista previa"
                    className="aspect-video h-full w-full object-contain"
                  />
                )}

                {tipoArchivo === "video" && vistaPrevia && (
                  <video
                    src={vistaPrevia}
                    controls
                    className="aspect-video h-full w-full object-contain"
                  />
                )}
              </div>

              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-slate-500">
                    Nombre
                  </dt>

                  <dd className="mt-1 break-all text-slate-900">
                    {archivo.name}
                  </dd>
                </div>

                <div>
                  <dt className="font-semibold text-slate-500">
                    Tipo
                  </dt>

                  <dd className="mt-1 text-slate-900">
                    {tipoArchivo === "imagen"
                      ? "Fotografía"
                      : "Vídeo"}
                  </dd>
                </div>

                <div>
                  <dt className="font-semibold text-slate-500">
                    Formato
                  </dt>

                  <dd className="mt-1 text-slate-900">
                    {archivo.type || "No identificado"}
                  </dd>
                </div>

                <div>
                  <dt className="font-semibold text-slate-500">
                    Tamaño
                  </dt>

                  <dd className="mt-1 text-slate-900">
                    {mostrarTamano(archivo.size)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}
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
              type="text"
              value={tituloGl}
              onChange={(event) => setTituloGl(event.target.value)}
              maxLength={200}
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
              type="text"
              value={tituloEs}
              onChange={(event) => setTituloEs(event.target.value)}
              maxLength={200}
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
              value={descripcionGl}
              onChange={(event) => setDescripcionGl(event.target.value)}
              rows={4}
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
              value={descripcionEs}
              onChange={(event) => setDescripcionEs(event.target.value)}
              rows={4}
              className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
            />
          </div>
        </div>
      </section>

      {tipoArchivo === "imagen" && (
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
                type="text"
                value={autorFotografia}
                onChange={(event) =>
                  setAutorFotografia(event.target.value)
                }
                maxLength={200}
                placeholder="Nombre del fotógrafo"
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
                type="date"
                value={fechaCaptura}
                onChange={(event) =>
                  setFechaCaptura(event.target.value)
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
                type="text"
                value={altGl}
                onChange={(event) => setAltGl(event.target.value)}
                maxLength={250}
                placeholder="Describe brevemente a fotografía"
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
                type="text"
                value={altEs}
                onChange={(event) => setAltEs(event.target.value)}
                maxLength={250}
                placeholder="Describe brevemente la fotografía"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>
        </section>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="flex cursor-pointer items-start gap-4">
          <input
            type="checkbox"
            checked={publicado}
            onChange={(event) => setPublicado(event.target.checked)}
            className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-700 focus:ring-sky-600"
          />

          <span>
            <span className="block font-semibold text-slate-900">
              Publicar en la galería
            </span>

            <span className="mt-1 block text-sm leading-6 text-slate-600">
              Si no marcas esta opción, el archivo quedará guardado
              en la biblioteca pero no será visible en la web pública.
            </span>
          </span>
        </label>
      </section>

      {estado === "subiendo" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
            <span>Procesando</span>
            <span>{progreso}%</span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full bg-sky-700 transition-all"
              style={{
                width: `${progreso}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!archivo || estado === "subiendo"}
          className="rounded-xl bg-slate-900 px-7 py-3 font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {estado === "subiendo"
            ? "Subiendo..."
            : "Añadir a la galería"}
        </button>
      </div>
    </form>
  );
}