import Footer from "@/components/Footer"
import EnConstruccion from "@/components/EnConstruccion"
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n"
import { getDictionary } from "@/lib/dictionary"

export default async function Noticias({
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
      <EnConstruccion
        title={isGL ? "Novas" : "Noticias"}
        subtitle={
          isGL
            ? "Esta sección está en construción. Publicaremos aquí novas breves con fotos: avisos, resumos de actividades e comunicacións da asociación."
            : "Esta sección está en construcción. Publicaremos aquí noticias breves con fotos: avisos, resúmenes de actividades y comunicaciones de la asociación."
        }
      />
      <Footer lang={lang} />
    </>
  )
}
