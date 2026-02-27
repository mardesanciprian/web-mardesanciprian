import Header from "@/components/Header";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: "es" }, { lang: "gl" }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang?: string } | Promise<{ lang?: string }>;
}) {
  const awaitedParams = await Promise.resolve(params);
  const raw = awaitedParams?.lang ?? "";
  const lang = raw.toLowerCase().trim() === "gl" ? "gl" : "es";

  return (
    <>
      <Header lang={lang as "es" | "gl"} />
      {children}
    </>
  );
}
