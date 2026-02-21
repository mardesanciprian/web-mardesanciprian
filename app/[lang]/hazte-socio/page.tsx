import Footer from "@/components/Footer"
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n"
import { getDictionary } from "@/lib/dictionary"

export default async function HazteSocio({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang: langParam } = await params
  const lang: Locale = isLocale(langParam) ? langParam : defaultLocale
  const t = await getDictionary(lang)
  const isGL = lang === "gl"

  return (
    <>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        <h1 className="text-4xl font-bold text-slate-900">
          {isGL ? "Faite socio" : "Hazte socio"}
        </h1>

        <p className="text-slate-600 mt-4 max-w-2xl">
          {isGL
            ? "Se queres formar parte da Asociación Mar de San Ciprián, cubrir este formulario permitirache recibir información das actividades e participar na vida da asociación."
            : "Si quieres formar parte de la Asociación Mar de San Ciprián, cubrir este formulario te permitirá recibir información de las actividades y participar en la vida de la asociación."}
        </p>

        <div className="grid md:grid-cols-2 gap-12 mt-12">

          {/* INFO */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900">
                {isGL ? "Por que facerse socio?" : "¿Por qué hacerse socio?"}
              </h2>

              <ul className="mt-4 space-y-2 text-slate-700">
                <li>• {isGL ? "Participar nas actividades e eventos." : "Participar en actividades y eventos."}</li>
                <li>• {isGL ? "Recibir información exclusiva." : "Recibir información exclusiva."}</li>
                <li>• {isGL ? "Apoiar a cultura mariñeira local." : "Apoyar la cultura marinera local."}</li>
                <li>• {isGL ? "Formar parte da comunidade." : "Formar parte de la comunidad."}</li>
              </ul>
            </div>

            <div className="rounded-3xl bg-slate-50 border border-black/5 p-6">
              <h2 className="text-xl font-bold text-slate-900">
                {isGL ? "Información importante" : "Información importante"}
              </h2>
              <p className="mt-3 text-slate-700">
                {isGL
                  ? "A cota e as condicións de alta serán comunicadas proximamente pola asociación."
                  : "La cuota y las condiciones de alta serán comunicadas próximamente por la asociación."}
              </p>
            </div>
          </div>

          {/* FORMULARIO */}
          <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900">
              {isGL ? "Formulario de inscrición" : "Formulario de inscripción"}
            </h2>

            <form className="mt-6 space-y-4">
              <input
                placeholder={isGL ? "Nome completo" : "Nombre completo"}
                className="w-full border border-black/10 rounded-xl px-4 py-3"
              />
              <input
                placeholder="Email"
                className="w-full border border-black/10 rounded-xl px-4 py-3"
              />
              <input
                placeholder={isGL ? "Teléfono" : "Teléfono"}
                className="w-full border border-black/10 rounded-xl px-4 py-3"
              />
              <textarea
                placeholder={isGL ? "Observacións (opcional)" : "Observaciones (opcional)"}
                rows={4}
                className="w-full border border-black/10 rounded-xl px-4 py-3"
              />

              <button
                type="button"
                className="rounded-2xl bg-slate-900 text-white px-6 py-3 font-semibold"
              >
                {isGL ? "Enviar solicitude (próximamente)" : "Enviar solicitud (próximamente)"}
              </button>
            </form>
          </div>

        </div>
      </main>

      <Footer lang={lang} />
    </>
  )
}
