export default function EnConstruccion({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
      <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-8">
        <div className="text-sm font-semibold text-slate-500">🚧</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
          {title}
        </h1>
        <p className="text-slate-700 mt-4 leading-relaxed">{subtitle}</p>

        <div className="mt-8 rounded-2xl bg-slate-50 border border-black/5 p-5 text-slate-700">
          <div className="font-semibold">Próximamente</div>
          <ul className="mt-2 space-y-1">
            <li>• Publicación de contenido real</li>
            <li>• Entradas con fotos</li>
            <li>• Archivo de noticias</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
