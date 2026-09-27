import { computed } from "vue"
import type { Ref } from "vue"
import { useI18n } from "./useI18n"

export interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions {
  fallback?: string
  locale?: string
}

export function useDateTime(
  customLocale?: Ref<string | undefined> | string,
  customTimezone?: Ref<string | undefined> | string
) {
  const { locale: activeLocale } = useI18n()

  const locale = computed<string>(() => {
    if (typeof customLocale === "string" && customLocale) {
      return customLocale
    }

    if (customLocale && typeof customLocale === "object" && "value" in customLocale && customLocale.value) {
      return customLocale.value
    }

    return activeLocale.value === "es" ? "es-MX" : "en-US"
  })

  const timezone = computed<string | undefined>(() => {
    if (typeof customTimezone === "string" && customTimezone) {
      return customTimezone
    }

    if (customTimezone && typeof customTimezone === "object" && "value" in customTimezone && customTimezone.value) {
      return customTimezone.value
    }

    return undefined
  })

  function toDate(date: Date | string | number | null | undefined): Date | null {
    if (date === null || date === undefined || date === "") {
      return null
    }

    const d = date instanceof Date ? date : new Date(date)
    return isNaN(d.getTime()) ? null : d
  }

  function formatDate(
    date: Date | string | number | null | undefined,
    options: DateTimeFormatOptions = {}
  ): string {
    const d = toDate(date)
    if (!d) {
      return options.fallback ?? ""
    }

    const targetLocale = options.locale || locale.value
    const intlOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: timezone.value,
      ...options
    }

    delete (intlOptions as any).fallback
    delete (intlOptions as any).locale

    try {
      return new Intl.DateTimeFormat(targetLocale, intlOptions).format(d)
    } catch {
      return d.toLocaleDateString()
    }
  }

  function formatDateTime(
    date: Date | string | number | null | undefined,
    options: DateTimeFormatOptions = {}
  ): string {
    return formatDate(date, {
      hour: "numeric",
      minute: "numeric",
      ...options
    })
  }

  function formatRelative(
    date: Date | string | number | null | undefined,
    baseDate: Date = new Date()
  ): string {
    const d = toDate(date)
    if (!d) {
      return ""
    }

    const diffSeconds = Math.round((d.getTime() - baseDate.getTime()) / 1000)
    const diffMinutes = Math.round(diffSeconds / 60)
    const diffHours = Math.round(diffMinutes / 60)
    const diffDays = Math.round(diffHours / 24)

    try {
      const rtf = new Intl.RelativeTimeFormat(locale.value, { numeric: "auto" })

      if (Math.abs(diffDays) >= 1) {
        return rtf.format(diffDays, "day")
      }
      if (Math.abs(diffHours) >= 1) {
        return rtf.format(diffHours, "hour")
      }
      if (Math.abs(diffMinutes) >= 1) {
        return rtf.format(diffMinutes, "minute")
      }
      return rtf.format(diffSeconds, "second")
    } catch {
      return formatDate(d)
    }
  }

  return {
    locale,
    timezone,
    formatDate,
    formatDateTime,
    formatRelative
  }
}
