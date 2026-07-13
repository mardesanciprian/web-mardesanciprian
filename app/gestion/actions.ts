"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function iniciarSesion(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect(
      "/gestion?error=" +
        encodeURIComponent(
          "Introduce el correo electrónico y la contraseña."
        )
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(
      "/gestion?error=" +
        encodeURIComponent(
          "El correo electrónico o la contraseña no son correctos."
        )
    );
  }

  redirect("/gestion/bitacora");
}

export async function cerrarSesion() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/gestion");
}