export default function Footer({ lang }: { lang: "es" | "gl" }) {
  const isGL = lang === "gl"

  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="font-bold text-slate-900">Asociación Mar de San Ciprián</div>
            <div className="text-sm text-slate-600 mt-2">
              {isGL ? "Cultura · Tradición · Comunidade" : "Cultura · Tradición · Comunidad"}
            </div>
            <p className="mt-4 text-slate-600">
              {isGL
                ? "Un punto de encontro arredor do mar e da nosa identidade local."
                : "Un punto de encuentro alrededor del mar y de nuestra identidad local."}
            </p>
          </div>

          <div>
            <div className="font-semibold text-slate-900">{isGL ? "Contacto" : "Contacto"}</div>
            <div className="mt-3 space-y-2 text-slate-600">
              <div>📍 San Ciprián (Cervo), A Mariña Lucense</div>
              <div>✉️ <span className="text-slate-700">info@pendiente.com</span></div>
              <div className="text-sm text-slate-500">
                {isGL ? "Engadiremos o email oficial cando o teñades." : "Añadiremos el email oficial cuando lo tengáis."}
              </div>
            </div>
          </div>

          <div>
            <div className="font-semibold text-slate-900">{isGL ? "Redes sociais" : "Redes sociales"}</div>
            <div className="mt-3 flex flex-wrap gap-3">
              <a className="rounded-2xl border border-black/10 px-4 py-2 font-semibold hover:bg-slate-50" href="#" target="_blank">Instagram</a>
              <a className="rounded-2xl border border-black/10 px-4 py-2 font-semibold hover:bg-slate-50" href="#" target="_blank">Facebook</a>
              <a className="rounded-2xl border border-black/10 px-4 py-2 font-semibold hover:bg-slate-50" href="#" target="_blank">TikTok</a>
            </div>
          </div>
        </div>

        <div className="mt-10 text-sm text-slate-500 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} Asociación Mar de San Ciprián</div>
          <div className="flex gap-4">
            <a className="hover:underline" href="#">{isGL ? "Aviso legal" : "Aviso legal"}</a>
            <a className="hover:underline" href="#">{isGL ? "Privacidade" : "Privacidad"}</a>
            <a className="hover:underline" href="#">{isGL ? "Cookies" : "Cookies"}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
