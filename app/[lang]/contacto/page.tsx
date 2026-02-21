import Footer from "@/components/Footer"
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n"
import { getDictionary } from "@/lib/dictionary"

export default async function Contacto({
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
          {isGL ? "Contacto" : "Contacto"}
        </h1>

        <p className="text-slate-600 mt-4 max-w-2xl">
          {isGL
            ? "Se queres contactar coa asociación, colaborar ou recibir información das actividades, podes facelo a través deste formulario."
            : "Si quieres contactar con la asociación, colaborar o recibir información de las actividades, puedes hacerlo a través de este formulario."}
        </p>

        <div className="grid md:grid-cols-2 gap-12 mt-12">

          {/* DATOS */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900">
                {isGL ? "Información" : "Información"}
              </h2>

              <div className="mt-4 space-y-3 text-slate-700">
                <div>📍 San Ciprián (Cervo), A Mariña Lucense</div>
                <div>✉️ info@pendiente.com</div>
                <div>
                  {isGL
                    ? "As redes sociais estarán dispoñibles en breve."
                    : "Las redes sociales estarán disponibles en breve."}
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 border border-black/5 p-6">
              <h2 className="text-xl font-bold text-slate-900">
                {isGL ? "Síguenos" : "Síguenos"}
              </h2>

              <div className="mt-4 flex flex-wrap gap-3">
                <button className="rounded-2xl border border-black/10 px-4 py-2 font-semibold">
                  Instagram
                </button>
                <button className="rounded-2xl border border-black/10 px-4 py-2 font-semibold">
                  Facebook
                </button>
                <button className="rounded-2xl border border-black/10 px-4 py-2 font-semibold">
                  TikTok
                </button>
              </div>
            </div>
          </div>

          {/* FORMULARIO */}
          <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900">
              {isGL ? "Enviar mensaxe" : "Enviar mensaje"}
            </h2>

            <form className="mt-6 space-y-4">
              <input
                placeholder={isGL ? "Nome" : "Nombre"}
                className="w-full border border-black/10 rounded-xl px-4 py-3"
              />
              <input
                placeholder="Email"
                className="w-full border border-black/10 rounded-xl px-4 py-3"
              />
              <textarea
                placeholder={isGL ? "Mensaxe" : "Mensaje"}
                rows={5}
                className="w-full border border-black/10 rounded-xl px-4 py-3"
              />

              <button
                type="button"
                className="rounded-2xl bg-slate-900 text-white px-6 py-3 font-semibold"
              >
                {isGL ? "Enviar (próximamente)" : "Enviar (próximamente)"}
              </button>
            </form>
          </div>

        </div>
      </main>

      <Footer lang={lang} />
    </>
  )
}
