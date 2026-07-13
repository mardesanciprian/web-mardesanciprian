import Image from "next/image";
import Footer from "@/components/Footer";
import FormularioSocio from "@/components/FormularioSocio";
import {
  isLocale,
  defaultLocale,
  type Locale,
} from "@/lib/i18n";

export default async function HazteSocio({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;

  const lang: Locale = isLocale(langParam)
    ? langParam
    : defaultLocale;

  const isGL = lang === "gl";

  return (
    <>
      <main className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
            {isGL
              ? "Forma parte da asociación"
              : "Forma parte de la asociación"}
          </p>

          <div className="mt-3 grid gap-4 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              {isGL ? "Faite socio" : "Hazte socio"}
            </h1>

            <p className="max-w-3xl text-base leading-7 text-slate-600 lg:justify-self-end">
              {isGL
                ? "Axúdanos a conservar a historia, a cultura e o patrimonio marítimo de San Ciprián. A túa participación fortalece o proxecto e impulsa novas actividades para toda a comunidade."
                : "Ayúdanos a conservar la historia, la cultura y el patrimonio marítimo de San Ciprián. Tu participación fortalece el proyecto e impulsa nuevas actividades para toda la comunidad."}
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-xl shadow-slate-200/70">
          <div className="grid lg:grid-cols-[1.15fr_1.35fr]">
            <div className="relative min-h-[360px] lg:min-h-[680px]">
              <Image
                src="/images/hazte-socio-mar-de-san-ciprian.png"
                alt={
                  isGL
                    ? "Composición artística de embarcacións, velas e mar"
                    : "Composición artística de embarcaciones, velas y mar"
                }
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover object-center"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/5" />

              <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">
                  Mar de San Ciprián
                </p>

                <h2 className="mt-3 max-w-lg text-3xl font-bold leading-tight sm:text-4xl">
                  {isGL
                    ? "Cultura · Tradición · Comunidade"
                    : "Cultura · Tradición · Comunidad"}
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="mb-6 flex flex-col gap-2 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {isGL
                      ? "Formulario de inscrición"
                      : "Formulario de inscripción"}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {isGL
                      ? "Completa os datos indicados para formar parte da asociación."
                      : "Completa los datos indicados para formar parte de la asociación."}
                  </p>
                </div>

                <p className="text-xs font-medium text-slate-500">
                  {isGL
                    ? "* Campos obrigatorios"
                    : "* Campos obligatorios"}
                </p>
              </div>

              <FormularioSocio lang={lang} />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <article className="rounded-3xl border border-black/5 bg-slate-50 p-6">
            <h2 className="text-lg font-bold text-slate-900">
              {isGL
                ? "Por que facerse socio?"
                : "¿Por qué hacerse socio?"}
            </h2>

            <p className="mt-3 leading-7 text-slate-700">
              {isGL
                ? "Participa nas actividades, recibe información das iniciativas e axúdanos a protexer a cultura e o patrimonio marítimo de San Ciprián."
                : "Participa en las actividades, recibe información de las iniciativas y ayúdanos a proteger la cultura y el patrimonio marítimo de San Ciprián."}
            </p>
          </article>

          <article className="rounded-3xl border border-sky-100 bg-sky-50 p-6">
            <h2 className="text-lg font-bold text-slate-900">
              {isGL
                ? "Protección dos teus datos"
                : "Protección de tus datos"}
            </h2>

            <p className="mt-3 leading-7 text-slate-700">
              {isGL
                ? "A información persoal estará protexida e só poderá ser consultada polas persoas autorizadas pola asociación."
                : "La información personal estará protegida y solo podrá ser consultada por las personas autorizadas por la asociación."}
            </p>
          </article>
        </section>
      </main>

      <Footer lang={lang} />
    </>
  );
}