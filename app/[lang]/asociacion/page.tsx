import Footer from "@/components/Footer"
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n"
import { getDictionary } from "@/lib/dictionary"

export default async function Asociacion({
params,
}: {
  params: { lang: string }
}) {
  const { lang: langParam } = params
  const lang: Locale = isLocale(langParam) ? langParam : defaultLocale
  const t = await getDictionary(lang)
  const isGL = lang === "gl"


  const board = [
    { name: "Ramón Rivas Villares", roleES: "Presidente", roleGL: "Presidente" },
    { name: "Francisco Frá Rico", roleES: "Vicepresidente", roleGL: "Vicepresidente" },
    { name: "Ángel Fernández Véquez", roleES: "Secretario", roleGL: "Secretario" },
    { name: "José Manuel Casas López", roleES: "Tesorero", roleGL: "Tesoureiro" },
    { name: "José Antonio García Casas", roleES: "Vocal", roleGL: "Vogal" },
    { name: "Juan Antonio Díez García", roleES: "Vocal (Redes Sociales)", roleGL: "Vogal (Redes sociais)" },
    { name: "José Cobas", roleES: "Vocal", roleGL: "Vogal" },
    { name: "Manuel Granados", roleES: "Vocal", roleGL: "Vogal" },
  ]

  return (
    <>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
<h1 className="text-4xl font-bold text-slate-900">
  {isGL ? "A Asociación" : "La Asociación"}
</h1>



        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            {isGL ? "A nosa historia" : "Nuestra historia"}
          </h2>
          <p className="text-slate-700 leading-relaxed mt-4">
            {isGL
              ? "A Asociación Mar de San Ciprián nace coa vontade de conservar, promover e compartir a cultura mariñeira e o patrimonio ligado ao mar, que forma parte da identidade da nosa vila. Traballamos para manter vivas as tradicións e impulsar actividades culturais e sociais abertas a toda a comunidade."
              : "La Asociación Mar de San Ciprián nace con la voluntad de conservar, promover y compartir la cultura marinera y el patrimonio ligado al mar, que forma parte de la identidad de nuestra villa. Trabajamos para mantener vivas las tradiciones e impulsar actividades culturales y sociales abiertas a toda la comunidad."}
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            {isGL ? "A nosa misión" : "Nuestra misión"}
          </h2>
          <ul className="mt-4 space-y-2 text-slate-700">
            <li>• {isGL ? "Promover a cultura e tradición mariñeira." : "Promover la cultura y tradición marinera."}</li>
            <li>• {isGL ? "Organizar actividades culturais, divulgativas e sociais." : "Organizar actividades culturales, divulgativas y sociales."}</li>
            <li>• {isGL ? "Fomentar a participación veciñal e a convivencia." : "Fomentar la participación vecinal y la convivencia."}</li>
            <li>• {isGL ? "Poñer en valor o patrimonio marítimo e local." : "Poner en valor el patrimonio marítimo y local."}</li>
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold text-slate-900">
            {isGL ? "Xunta Directiva" : "Junta Directiva"}
          </h2>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {board.map((m) => (
              <div key={m.name} className="rounded-3xl bg-white border border-black/5 shadow-sm p-5">
                <div className="font-semibold text-slate-900">{m.name}</div>
                <div className="text-slate-600 mt-1">
                  {isGL ? m.roleGL : m.roleES}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </>
  )
}
