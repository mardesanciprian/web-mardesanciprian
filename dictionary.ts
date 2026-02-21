import "server-only"
import type { Locale } from "./i18n"

const dictionaries = {
  es: () => import("@/dictionaries/es.json").then((m) => m.default),
  gl: () => import("@/dictionaries/gl.json").then((m) => m.default),
} as const

export async function getDictionary(lang: Locale) {
  return dictionaries[lang]()
}