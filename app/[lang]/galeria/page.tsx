import Footer from "@/components/Footer"
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n"
import { getDictionary } from "@/lib/dictionary"

const images = [
  "/images/hero.jpg",
  "/images/hero.jpg",
  "/images/hero.jpg",
  "/images/hero.jpg",
  "/images/hero.jpg",
  "/images/hero.jpg",
]

export default async function Galeria({
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

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <h1 className="text-4xl font-bold text-slate-900">
          {isGL ? "Galería" : "Galería"}
        </h1>

        <p className="text-slate-600 mt-4 max-w-2xl">
          {isGL
            ? "Espazo aberto para compartir imaxes do mar, das actividades e da vida da asociación."
            : "Espacio abierto para compartir imágenes del mar, de las actividades y de la vida de la asociación."}
        </p>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((src, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-black/5 shadow-sm"
            >
              <img
                src={src}
                alt="Galería"
                className="w-full h-48 object-cover hover:scale-105 transition"
              />
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-3xl bg-slate-50 border border-black/5 p-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {isGL ? "Queres compartir unha foto?" : "¿Quieres compartir una foto?"}
          </h2>

          <p className="text-slate-600 mt-3">
            {isGL
              ? "En breve poderás enviar as túas imaxes relacionadas coa asociación e a contorna de San Ciprián."
              : "Pronto podrás enviar tus imágenes relacionadas con la asociación y el entorno de San Ciprián."}
          </p>

          <div className="mt-6">
            <button className="rounded-2xl bg-slate-900 text-white px-6 py-3 font-semibold">
              {isGL ? "Enviar foto (próximamente)" : "Enviar foto (próximamente)"}
            </button>
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </>
  )
}
