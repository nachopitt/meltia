import { computed } from "vue"
import type { Ref } from "vue"
import { useI18n } from "./useI18n"

export interface CurrencyFormatOptions extends Intl.NumberFormatOptions {
  fallback?: string
  currency?: string
  locale?: string
}

export function useCurrency(
  customCurrency?: Ref<string | undefined> | string,
  customLocale?: Ref<string | undefined> | string
) {
  const { locale: activeLocale } = useI18n()

  const currency = computed<string>(() => {
    if (typeof customCurrency === "string" && customCurrency) {
      return customCurrency
    }

    if (customCurrency && typeof customCurrency === "object" && "value" in customCurrency && customCurrency.value) {
      return customCurrency.value
    }

    return "MXN"
  })

  const locale = computed<string>(() => {
    if (typeof customLocale === "string" && customLocale) {
      return customLocale
    }

    if (customLocale && typeof customLocale === "object" && "value" in customLocale && customLocale.value) {
      return customLocale.value
    }

    return activeLocale.value === "es" ? "es-MX" : "en-US"
  })

  function formatCurrency(
    amount: number | string | null | undefined,
    options: CurrencyFormatOptions = {}
  ): string {
    if (amount === null || amount === undefined || amount === "") {
      return options.fallback ?? ""
    }

    const num = typeof amount === "string" ? parseFloat(amount) : amount

    if (isNaN(num)) {
      return options.fallback ?? ""
    }

    const targetCurrency = options.currency || currency.value
    const targetLocale = options.locale || locale.value

    const intlOptions: Intl.NumberFormatOptions = {
      style: "currency",
      currency: targetCurrency,
      maximumFractionDigits: 0,
      ...options
    }

    delete (intlOptions as any).fallback
    delete (intlOptions as any).locale

    try {
      return new Intl.NumberFormat(targetLocale, intlOptions).format(num)
    } catch {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: targetCurrency || "MXN"
      }).format(num)
    }
  }

  return {
    currency,
    locale,
    formatCurrency
  }
}
