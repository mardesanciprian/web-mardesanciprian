import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";

export default async function MerchandisingPage({
  params,
}: {
  params: { lang?: string } | Promise<{ lang?: string }>;
}) {
  const awaitedParams = await Promise.resolve(params);
  const rawLang = awaitedParams?.lang ?? "";
  const langParam = rawLang.toLowerCase().trim();
  const lang: Locale = isLocale(langParam) ? (langParam as Locale) : defaultLocale;

  const isGL = lang === "gl";

  const t = isGL
    ? {
        title: "Merchandising",
        intro:
          "Proposta visual dunha pequena colección oficial en azul mariño co noso logo. Sen tenda nin prezos.",
        textileTitle: "Tallas e modelos (téxtil)",
        textileNote:
          "As pezas téxtiles (camiseta/polo e sudadeira) faríanse en versión home e muller, coa talla precisa para cada persoa.",
        noteTitle: "Nota",
        note:
          "Se no futuro hai interese, poderíase valorar a produción destes artigos. Por agora é unha mostra para a xunta e para o público.",
      }
    : {
        title: "Merchandising",
        intro:
          "Propuesta visual de una pequeña colección oficial en azul marino con nuestro logo. Sin tienda ni precios.",
        textileTitle: "Tallas y modelos (textil)",
        textileNote:
          "Las prendas textiles (camiseta/polo y sudadera) se harían en versión hombre y mujer, con la talla precisa para cada persona.",
        noteTitle: "Nota",
        note:
          "Si en el futuro hay interés, se podría valorar la producción de estos artículos. Por ahora es una muestra para la junta y para el público.",
      };

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
      <h1 className="text-3xl sm:text-4xl font-bold">{t.title}</h1>
      <p className="mt-3 text-gray-700 max-w-3xl">{t.intro}</p>

      {/* Imagen principal merchandising */}
      <div className="mt-8 rounded-3xl border bg-white shadow-sm overflow-hidden">
        <img
          src="/images/merch/set-merch.png"
          alt="Merchandising Asociación Mar de San Ciprián"
          className="w-full h-auto"
        />
      </div>

      {/* Info tallas */}
      <div className="mt-10 rounded-2xl border bg-white p-5">
        <p className="font-semibold">{t.textileTitle}</p>
        <p className="mt-2 text-gray-700">{t.textileNote}</p>
      </div>

      {/* Nota final */}
      <div className="mt-6 rounded-2xl border bg-gray-50 p-5">
        <p className="font-semibold">{t.noteTitle}</p>
        <p className="mt-2 text-gray-700">{t.note}</p>
      </div>
    </main>
  );
}
