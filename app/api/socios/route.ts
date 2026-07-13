import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type SolicitudSocio = {
  nombre?: unknown;
  apellidos?: unknown;
  email?: unknown;
  dni_nie?: unknown;
  fecha_nacimiento?: unknown;
  direccion?: unknown;
  codigo_postal?: unknown;
  localidad?: unknown;
  provincia?: unknown;
  pais?: unknown;
  telefono?: unknown;
  acepta_privacidad?: unknown;
};

function limpiarTexto(valor: unknown): string {
  return typeof valor === "string" ? valor.trim() : "";
}

function textoOpcional(valor: unknown): string | null {
  const texto = limpiarTexto(valor);
  return texto.length > 0 ? texto : null;
}

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabasePublishableKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabasePublishableKey) {
      return NextResponse.json(
        {
          ok: false,
          error: "La conexión con la base de datos no está configurada.",
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as SolicitudSocio;

    const nombre = limpiarTexto(body.nombre);
    const apellidos = limpiarTexto(body.apellidos);
    const email = limpiarTexto(body.email).toLowerCase();
    const localidad = limpiarTexto(body.localidad);
    const provincia = limpiarTexto(body.provincia);
    const aceptaPrivacidad = body.acepta_privacidad === true;

    if (
      nombre.length < 2 ||
      apellidos.length < 2 ||
      localidad.length < 2 ||
      provincia.length < 2
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Faltan datos obligatorios.",
        },
        { status: 400 }
      );
    }

    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(email)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Correo electrónico no válido.",
        },
        { status: 400 }
      );
    }

    if (!aceptaPrivacidad) {
      return NextResponse.json(
        {
          ok: false,
          error: "Debe aceptar la política de privacidad.",
        },
        { status: 400 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      supabasePublishableKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const { error } = await supabase
      .from("socios")
      .insert({
        nombre,
        apellidos,
        email,
        dni_nie: textoOpcional(body.dni_nie)?.toUpperCase() ?? null,
        fecha_nacimiento: textoOpcional(body.fecha_nacimiento),
        direccion: textoOpcional(body.direccion),
        codigo_postal: textoOpcional(body.codigo_postal),
        localidad,
        provincia,
        pais: textoOpcional(body.pais) ?? "España",
        telefono: textoOpcional(body.telefono),
        acepta_privacidad: true,
      });

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          ok: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: "Socio registrado correctamente.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error: "Error interno del servidor.",
      },
      { status: 500 }
    );
  }
}