"use client";

import { FormEvent, useState } from "react";
import type { Locale } from "@/lib/i18n";

type FormularioSocioProps = {
  lang: Locale;
};

type EstadoEnvio =
  | { tipo: "inicial"; mensaje: "" }
  | { tipo: "enviando"; mensaje: string }
  | { tipo: "exito"; mensaje: string }
  | { tipo: "error"; mensaje: string };

const estadoInicial: EstadoEnvio = {
  tipo: "inicial",
  mensaje: "",
};

export default function FormularioSocio({
  lang,
}: FormularioSocioProps) {
  const isGL = lang === "gl";

  const [estado, setEstado] =
    useState<EstadoEnvio>(estadoInicial);

  async function enviarFormulario(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const formulario = event.currentTarget;
    const datos = new FormData(formulario);

    setEstado({
      tipo: "enviando",
      mensaje: isGL
        ? "Enviando a inscrición..."
        : "Enviando la inscripción...",
    });

    const payload = {
      nombre: datos.get("nombre"),
      apellidos: datos.get("apellidos"),
      email: datos.get("email"),
      telefono: datos.get("telefono"),
      dni_nie: datos.get("dni_nie"),
      fecha_nacimiento: datos.get("fecha_nacimiento"),
      direccion: datos.get("direccion"),
      codigo_postal: datos.get("codigo_postal"),
      localidad: datos.get("localidad"),
      provincia: datos.get("provincia"),
      pais: datos.get("pais"),
      acepta_privacidad:
        datos.get("acepta_privacidad") === "on",
    };

    try {
      const respuesta = await fetch("/api/socios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const resultado = (await respuesta.json()) as {
        ok?: boolean;
        message?: string;
        error?: string;
      };

      if (!respuesta.ok || !resultado.ok) {
        throw new Error(
          resultado.error ||
            (isGL
              ? "Non se puido completar a inscrición."
              : "No se pudo completar la inscripción.")
        );
      }

      formulario.reset();

      setEstado({
        tipo: "exito",
        mensaje: isGL
          ? "A inscrición foi rexistrada correctamente. Grazas por formar parte de Mar de San Ciprián."
          : "La inscripción se ha registrado correctamente. Gracias por formar parte de Mar de San Ciprián.",
      });
    } catch (error) {
      setEstado({
        tipo: "error",
        mensaje:
          error instanceof Error
            ? error.message
            : isGL
              ? "Produciuse un erro inesperado."
              : "Se ha producido un error inesperado.",
      });
    }
  }

  const campo =
    "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-700 focus:ring-2 focus:ring-sky-100";

  const etiqueta =
    "mb-1.5 block text-sm font-semibold text-slate-800";

  const enviando = estado.tipo === "enviando";

  return (
    <form
      onSubmit={enviarFormulario}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="nombre" className={etiqueta}>
            {isGL ? "Nome" : "Nombre"} *
          </label>

          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            minLength={2}
            maxLength={100}
            autoComplete="given-name"
            className={campo}
          />
        </div>

        <div>
          <label htmlFor="apellidos" className={etiqueta}>
            {isGL ? "Apelidos" : "Apellidos"} *
          </label>

          <input
            id="apellidos"
            name="apellidos"
            type="text"
            required
            minLength={2}
            maxLength={150}
            autoComplete="family-name"
            className={campo}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={etiqueta}>
            {isGL ? "Correo electrónico" : "Correo electrónico"} *
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            className={campo}
          />
        </div>

        <div>
          <label htmlFor="telefono" className={etiqueta}>
            {isGL ? "Teléfono" : "Teléfono"}
          </label>

          <input
            id="telefono"
            name="telefono"
            type="tel"
            maxLength={30}
            autoComplete="tel"
            className={campo}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="dni_nie" className={etiqueta}>
            DNI / NIE
          </label>

          <input
            id="dni_nie"
            name="dni_nie"
            type="text"
            maxLength={20}
            autoComplete="off"
            className={campo}
          />
        </div>

        <div>
          <label
            htmlFor="fecha_nacimiento"
            className={etiqueta}
          >
            {isGL
              ? "Data de nacemento"
              : "Fecha de nacimiento"}
          </label>

          <input
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            type="date"
            autoComplete="bday"
            className={campo}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_150px]">
        <div>
          <label htmlFor="direccion" className={etiqueta}>
            {isGL ? "Enderezo" : "Dirección"}
          </label>

          <input
            id="direccion"
            name="direccion"
            type="text"
            maxLength={200}
            autoComplete="street-address"
            className={campo}
          />
        </div>

        <div>
          <label
            htmlFor="codigo_postal"
            className={etiqueta}
          >
            {isGL ? "Código postal" : "Código postal"}
          </label>

          <input
            id="codigo_postal"
            name="codigo_postal"
            type="text"
            maxLength={12}
            autoComplete="postal-code"
            className={campo}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="localidad" className={etiqueta}>
            {isGL ? "Localidade" : "Localidad"} *
          </label>

          <input
            id="localidad"
            name="localidad"
            type="text"
            required
            minLength={2}
            maxLength={100}
            autoComplete="address-level2"
            className={campo}
          />
        </div>

        <div>
          <label htmlFor="provincia" className={etiqueta}>
            {isGL ? "Provincia" : "Provincia"} *
          </label>

          <input
            id="provincia"
            name="provincia"
            type="text"
            required
            minLength={2}
            maxLength={100}
            autoComplete="address-level1"
            defaultValue="Lugo"
            className={campo}
          />
        </div>

        <div>
          <label htmlFor="pais" className={etiqueta}>
            {isGL ? "País" : "País"}
          </label>

          <input
            id="pais"
            name="pais"
            type="text"
            maxLength={100}
            autoComplete="country-name"
            defaultValue="España"
            className={campo}
          />
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-5 text-slate-700">
        <input
          name="acepta_privacidad"
          type="checkbox"
          required
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300"
        />

        <span>
          {isGL
            ? "Lin e acepto o tratamento dos meus datos persoais para xestionar a miña inscrición na Asociación Mar de San Ciprián."
            : "He leído y acepto el tratamiento de mis datos personales para gestionar mi inscripción en la Asociación Mar de San Ciprián."}
          {" *"}
        </span>
      </label>

      {estado.tipo !== "inicial" && (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-xl border px-4 py-3 text-sm font-medium ${
            estado.tipo === "exito"
              ? "border-green-200 bg-green-50 text-green-800"
              : estado.tipo === "error"
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-slate-200 bg-slate-50 text-slate-700"
          }`}
        >
          {estado.mensaje}
        </div>
      )}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          *{" "}
          {isGL
            ? "Campos obrigatorios."
            : "Campos obligatorios."}
        </p>

        <button
          type="submit"
          disabled={enviando}
          className="rounded-xl bg-slate-900 px-8 py-3 font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {enviando
            ? isGL
              ? "Enviando..."
              : "Enviando..."
            : isGL
              ? "Facerme socio"
              : "Hacerme socio"}
        </button>
      </div>
    </form>
  );
}