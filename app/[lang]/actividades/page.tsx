
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";

type Actividad = {
  id: string;
  titulo_gl: string;
  titulo_es: string;
  descripcion_gl: string | null;
  descripcion_es: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  lugar: string | null;
  categoria: string | null;
  imagen_url: string | null;
};

function mostrarFecha(fecha: string | null, lang: Locale) {
  if (!fecha) return null;

  return new Intl.DateTimeFormat(
    lang === "gl" ? "gl-ES" : "es-ES",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Madrid",
    }
  ).format(new Date(fecha));
}

export default async function Actividades({
  params,
}: {
  params: Promise<{ lang?: string }>;
}) {
  const { lang: rawLang = "" } = await params;
  const langParam = rawLang.toLowerCase().trim();

  const lang: Locale = isLocale(langParam)
    ? (langParam as Locale)
    : defaultLocale;

  const isGL = lang === "gl";

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("actividades")
    .select(
      "id, titulo_gl, titulo_es, descripcion_gl, descripcion_es, fecha_inicio, fecha_fin, lugar, categoria, imagen_url"
    )
    .eq("estado", "publicada")
    .order("fecha_inicio", {
      ascending: true,
      nullsFirst: false,
    });

  if (error) {
    console.error("Error al cargar actividades públicas:", error);
  }

  const actividades = (data ?? []) as Actividad[];

  return (
    <>
      <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <h1 className="text-4xl font-bold text-slate-900">
          Actividades
        </h1>

        <p className="mt-4 leading-relaxed text-slate-700">
          {isGL
            ? "Descubre as actividades, encontros e eventos organizados pola Asociación Mar de San Ciprián."
            : "Descubre las actividades, encuentros y eventos organizados por la Asociación Mar de San Ciprián."}
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            {isGL
              ? "Calendario de actividades"
              : "Calendario de actividades"}
          </h2>

          {error ? (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8">
              <p className="text-slate-600">
                {isGL
                  ? "Non foi posible cargar as actividades neste momento."
                  : "No ha sido posible cargar las actividades en este momento."}
              </p>
            </div>
          ) : actividades.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900">
                {isGL
                  ? "Estamos preparando novas actividades"
                  : "Estamos preparando nuevas actividades"}
              </h3>

              <p className="mt-3 text-slate-600">
                {isGL
                  ? "En breve publicaremos aquí as próximas actividades da asociación."
                  : "Próximamente publicaremos aquí las actividades de la asociación."}
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {actividades.map((actividad) => {
                const titulo = isGL
                  ? actividad.titulo_gl
                  : actividad.titulo_es;

                const descripcion = isGL
                  ? actividad.descripcion_gl
                  : actividad.descripcion_es;

                return (
                  <article
                    key={actividad.id}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                  >
                    {actividad.imagen_url && (
                      <div className="aspect-video overflow-hidden bg-slate-100">
                        {/* Imagen externa introducida desde el Centro de Gestión */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={actividad.imagen_url}
                          alt={titulo}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="p-6">
                      {actividad.categoria && (
                        <p className="text-sm font-semibold text-sky-700">
                          {actividad.categoria}
                        </p>
                      )}

                      <h3 className="mt-2 text-xl font-bold text-slate-900">
                        {titulo}
                      </h3>

                      {descripcion && (
                        <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-600">
                          {descripcion}
                        </p>
                      )}

                      <dl className="mt-5 space-y-3 text-sm">
                        {actividad.fecha_inicio && (
                          <div>
                            <dt className="font-semibold text-slate-500">
                              {isGL ? "Data e hora" : "Fecha y hora"}
                            </dt>
                            <dd className="mt-1 text-slate-800">
                              {mostrarFecha(actividad.fecha_inicio, lang)}
                            </dd>
                          </div>
                        )}

                        {actividad.lugar && (
                          <div>
                            <dt className="font-semibold text-slate-500">
                              {isGL ? "Lugar" : "Lugar"}
                            </dt>
                            <dd className="mt-1 text-slate-800">
                              {actividad.lugar}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-3">
          <article className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              {isGL ? "Divulgación" : "Divulgación"}
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">
              {isGL
                ? "Cultura do mar e tradición"
                : "Cultura del mar y tradición"}
            </h3>
            <p className="mt-3 text-slate-600">
              {isGL
                ? "Encontros para compartir coñecemento e historia local."
                : "Encuentros para compartir conocimiento e historia local."}
            </p>
          </article>

          <article className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              {isGL ? "Saídas" : "Salidas"}
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">
              {isGL ? "Roteiros e visitas" : "Rutas y visitas"}
            </h3>
            <p className="mt-3 text-slate-600">
              {isGL
                ? "Actividades no porto, na costa e en espazos de interese."
                : "Actividades en el puerto, la costa y espacios de interés."}
            </p>
          </article>

          <article className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              {isGL ? "Eventos" : "Eventos"}
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">
              {isGL
                ? "Participación comunitaria"
                : "Participación comunitaria"}
            </h3>
            <p className="mt-3 text-slate-600">
              {isGL
                ? "Colaboracións, celebracións e actividades abertas."
                : "Colaboraciones, celebraciones y actividades abiertas."}
            </p>
          </article>
        </section>

        <div className="mt-10 rounded-3xl bg-slate-100 p-6">
          <p className="text-slate-700">
            {isGL
              ? "Tes algunha proposta de actividade? Gustaríanos coñecela."
              : "¿Tienes alguna propuesta de actividad? Nos gustaría conocerla."}
          </p>

          <a
            href={`/${lang}/contacto`}
            className="mt-3 inline-block font-semibold text-sky-800 hover:underline"
          >
            {isGL ? "Contacta connosco" : "Contacta con nosotros"} →
          </a>
        </div>
      </main>

      <Footer lang={lang} />
    </>
  );
}
