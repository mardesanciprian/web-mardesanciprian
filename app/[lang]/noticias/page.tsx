
import { redirect } from "next/navigation";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";

export default async function Noticias({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;

  const lang: Locale = isLocale(langParam)
    ? langParam
    : defaultLocale;

  redirect(`/${lang}/novas`);
}
