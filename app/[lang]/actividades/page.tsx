import Footer from "@/components/Footer";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";

export default async function Actividades({
  params,
}: {
  params: { lang?: string } | Promise<{ lang?: string }>;
}) {
  const awaitedParams = await Promise.resolve(params);
  const rawLang = awaitedParams?.lang ?? "";
  const langParam = rawLang.toLowerCase().trim();

  const lang: Locale = isLocale(langParam) ? (langParam as Locale) : defaultLocale;
  const t = await getDictionary(lang);
  const isGL = lang === "gl";

  return (
    <>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
        <h1 className="text-4xl font-bold text-slate-900">
          {isGL ? "Actividades" : "Actividades"}
        </h1>

        <p className="text-slate-700 leading-relaxed mt-4">
          {isGL
            ? "Aquí publicaremos o calendario de actividades (charlas, saídas e eventos) a medida que se vaian programando."
            : "Aquí publicaremos el calendario de actividades (charlas, salidas y eventos) a medida que se vayan programando."}
        </p>

        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-6">
            <div className="text-sm font-semibold text-slate-500">
              {isGL ? "Charlas e divulgación" : "Charlas y divulgación"}
            </div>
            <div className="text-xl font-bold text-slate-900 mt-2">
              {isGL ? "Cultura do mar e tradición" : "Cultura del mar y tradición"}
            </div>
            <p className="text-slate-600 mt-3">
              {isGL
                ? "Encontros para compartir coñecemento e historia local."
                : "Encuentros para compartir conocimiento e historia local."}
            </p>
          </div>

          <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-6">
            <div className="text-sm font-semibold text-slate-500">
              {isGL ? "Saídas" : "Salidas"}
            </div>
            <div className="text-xl font-bold text-slate-900 mt-2">
              {isGL ? "Roteiros e visitas" : "Rutas y visitas"}
            </div>
            <p className="text-slate-600 mt-3">
              {isGL
                ? "Actividades no porto, na costa e en espazos de interese."
                : "Actividades en el puerto, la costa y espacios de interés."}
            </p>
          </div>

          <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-6">
            <div className="text-sm font-semibold text-slate-500">
              {isGL ? "Eventos" : "Eventos"}
            </div>
            <div className="text-xl font-bold text-slate-900 mt-2">
              {isGL ? "Participación comunitaria" : "Participación comunitaria"}
            </div>
            <p className="text-slate-600 mt-3">
              {isGL
                ? "Colaboracións, celebracións e actividades abertas."
                : "Colaboraciones, celebraciones y actividades abiertas."}
            </p>
          </div>

          <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-6">
            <div className="text-sm font-semibold text-slate-500">
              {isGL ? "Aviso" : "Aviso"}
            </div>
            <div className="text-xl font-bold text-slate-900 mt-2">
              {isGL ? "Iremos actualizando esta sección" : "Iremos actualizando esta sección"}
            </div>
            <p className="text-slate-600 mt-3">
              {isGL
                ? "Se queres propoñer unha actividade, podes contactar connosco."
                : "Si quieres proponer una actividad, puedes contactar con nosotros."}
            </p>
            <a
              className="inline-block mt-5 font-semibold text-slate-900 hover:underline"
              href={`/${lang}/contacto`}
            >
              {isGL ? "Ir a contacto" : "Ir a contacto"} →
            </a>
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </>
  );
}
