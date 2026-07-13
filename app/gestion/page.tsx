import Link from "next/link";
import { iniciarSesion } from "./actions";

type GestionPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function GestionPage({
  searchParams,
}: GestionPageProps) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 shadow-2xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-700">
            Mar de San Ciprián
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Centro de Gestión
          </h1>

          <p className="mt-4 leading-7 text-slate-600">
            Acceso reservado para las personas autorizadas por la
            Asociación Mar de San Ciprián.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-7 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
          >
            {error}
          </div>
        )}

        <form action={iniciarSesion} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Correo electrónico
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Contraseña
            </label>

            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-sky-800"
          >
            Acceder al Centro de Gestión
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-sky-700 hover:underline"
          >
            ← Regresar a Mar de San Ciprián
          </Link>
        </div>
      </div>
    </main>
  );
}