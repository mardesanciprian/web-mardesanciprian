"use client";

import { useEffect, useState } from "react";

type VisorImagenProps = {
  src: string;
  alt: string;
  titulo?: string | null;
};

export default function VisorImagen({
  src,
  alt,
  titulo = null,
}: VisorImagenProps) {
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    if (!abierto) {
      return;
    }

    function cerrarConEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAbierto(false);
      }
    }

    document.addEventListener("keydown", cerrarConEscape);

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", cerrarConEscape);
      document.body.style.overflow = overflowAnterior;
    };
  }, [abierto]);

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="group block h-full w-full cursor-zoom-in"
        aria-label="Ampliar imagen"
      >
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      </button>

      {abierto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={titulo || alt}
          onClick={() => setAbierto(false)}
        >
          <button
            type="button"
            onClick={() => setAbierto(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 px-4 py-2 text-lg font-bold text-white transition hover:bg-white/20 sm:right-8 sm:top-8"
            aria-label="Cerrar visor"
          >
            ×
          </button>

          <div
            className="flex max-h-full max-w-6xl flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="max-h-[82vh] max-w-full object-contain shadow-2xl"
            />

            {titulo && (
              <p className="mt-4 max-w-3xl text-center text-sm font-semibold text-white sm:text-base">
                {titulo}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}