import Footer from "@/components/Footer";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";

export default async function Home({
  params,
}: {
  // Esto permite que Next nos lo pase como objeto o como Promise sin romper nada
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
      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0">
          <img
            src="/images/hero.jpg"
            alt="San Ciprián"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-3xl">
            <h1 className="text-white text-4xl sm:text-6xl font-bold leading-tight">
              {t.home.heroTitle}
            </h1>

            

            <p className="text-white/90 text-lg sm:text-2xl mt-5">
              {t.home.heroSubtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`/${lang}/hazte-socio`}
                className="rounded-2xl bg-white text-slate-900 px-6 py-3 font-semibold hover:bg-white/90"
              >
                {t.nav.join}
              </a>
              <a
                href={`/${lang}/contacto`}
                className="rounded-2xl border border-white/40 text-white px-6 py-3 font-semibold hover:bg-white/10"
              >
                {t.nav.contact}
              </a>
            </div>

            <div className="mt-10 rounded-3xl bg-white/10 border border-white/15 backdrop-blur px-6 py-5 text-white/90">
              {isGL ? (
                <p>
                  Somos unha asociación cultural, mariñeira e social sen ánimo de lucro.
                  Traballamos para conservar tradicións, apoiar a vida comunitaria e poñer
                  en valor o patrimonio do mar en San Ciprián e na Mariña Lucense.
                </p>
              ) : (
                <p>
                  Somos una asociación cultural, marinera y social sin ánimo de lucro.
                  Trabajamos para conservar tradiciones, apoyar la vida comunitaria y poner
                  en valor el patrimonio del mar en San Ciprián y en la Mariña Lucense.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECCIONES */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-7">
            <div className="text-sm font-semibold text-slate-500">
              {isGL ? "A Asociación" : "La Asociación"}
            </div>
            <div className="text-xl font-bold text-slate-900 mt-2">
              {isGL ? "Historia, misión e xunta directiva" : "Historia, misión y junta directiva"}
            </div>
            <p className="text-slate-600 mt-3">
              {isGL
                ? "Coñece quen somos e por que traballamos pola cultura mariñeira."
                : "Conoce quiénes somos y por qué trabajamos por la cultura marinera."}
            </p>
            <a
              className="inline-block mt-5 font-semibold text-slate-900 hover:underline"
              href={`/${lang}/asociacion`}
            >
              {isGL ? "Ver máis" : "Ver más"} →
            </a>
          </div>

          <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-7">
            <div className="text-sm font-semibold text-slate-500">
              {isGL ? "Actividades" : "Actividades"}
            </div>
            <div className="text-xl font-bold text-slate-900 mt-2">
              {isGL ? "Charlas, saídas e eventos" : "Charlas, salidas y eventos"}
            </div>
            <p className="text-slate-600 mt-3">
              {isGL
                ? "Iremos publicando aquí o calendario a medida que se programen."
                : "Iremos publicando aquí el calendario a medida que se programen."}
            </p>
            <a
              className="inline-block mt-5 font-semibold text-slate-900 hover:underline"
              href={`/${lang}/actividades`}
            >
              {isGL ? "Ver actividades" : "Ver actividades"} →
            </a>
          </div>

          <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-7">
            <div className="text-sm font-semibold text-slate-500">
              {isGL ? "Galería" : "Galería"}
            </div>
            <div className="text-xl font-bold text-slate-900 mt-2">
              {isGL ? "Fotos do mar e da comunidade" : "Fotos del mar y de la comunidad"}
            </div>
            <p className="text-slate-600 mt-3">
              {isGL
                ? "Un muro de fotos vinculadas á asociación e ao seu entorno."
                : "Un muro de fotos vinculadas a la asociación y a su entorno."}
            </p>
            <a
              className="inline-block mt-5 font-semibold text-slate-900 hover:underline"
              href={`/${lang}/galeria`}
            >
              {isGL ? "Entrar na galería" : "Entrar en la galería"} →
            </a>
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </>
  );
}
