import { ref, computed } from "vue"
import router from "../router"
import enDict from "../lang/en.json"
import esDict from "../lang/es.json"

export type LocaleCode = "en" | "es"

const STORAGE_KEY = "meltia_locale"
const SUPPORTED_LOCALES: LocaleCode[] = ["en", "es"]

function getInitialLocale(): LocaleCode {
  if (typeof window === "undefined") {
    return "en"
  }

  // 1. URL search param (?lang=es or ?locale=es)
  const params = new URLSearchParams(window.location.search)
  const urlLang = params.get("lang") || params.get("locale")
  if (urlLang && SUPPORTED_LOCALES.includes(urlLang as LocaleCode)) {
    return urlLang as LocaleCode
  }

  // 2. Local storage persistence
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && SUPPORTED_LOCALES.includes(stored as LocaleCode)) {
    return stored as LocaleCode
  }

  // 3. Browser language
  const browserLang = (navigator.language || "").toLowerCase()
  if (browserLang.startsWith("es")) {
    return "es"
  }

  return "en"
}

const currentLocale = ref<LocaleCode>(getInitialLocale())

const dictionaries: Record<LocaleCode, Record<string, string>> = {
  en: enDict as Record<string, string>,
  es: esDict as Record<string, string>
}

export function useI18n() {
  const locale = computed<LocaleCode>(() => currentLocale.value)

  const translations = computed<Record<string, string>>(() => {
    return dictionaries[currentLocale.value] || dictionaries.en
  })

  function setLocale(newLocale: LocaleCode) {
    if (!SUPPORTED_LOCALES.includes(newLocale)) {
      return
    }

    currentLocale.value = newLocale

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newLocale)

      // Sync URL via Vue Router or fallback
      try {
        const currentQuery = { ...router.currentRoute.value.query }
        if (newLocale === "en") {
          delete currentQuery.lang
          delete currentQuery.locale
        } else {
          currentQuery.lang = newLocale
        }
        router.replace({ query: currentQuery })
      } catch {
        const url = new URL(window.location.href)
        if (newLocale === "en") {
          url.searchParams.delete("lang")
          url.searchParams.delete("locale")
        } else {
          url.searchParams.set("lang", newLocale)
        }
        window.history.replaceState({}, "", url.toString())
      }
    }
  }

  function $t(key: string, replacements: Record<string, string | number> = {}): string {
    if (!key) return ""
    let translation = translations.value[key] || key

    Object.keys(replacements).forEach((placeholder) => {
      translation = translation.replace(
        new RegExp(`:${placeholder}`, "g"),
        String(replacements[placeholder])
      )
    })

    return translation
  }

  return {
    locale,
    setLocale,
    translations,
    $t
  }
}
