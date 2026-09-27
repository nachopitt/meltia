import type { CurrencyFormatOptions } from "@/composables/useCurrency"
import type { DateTimeFormatOptions } from "@/composables/useDateTime"

declare module "vue" {
  interface ComponentCustomProperties {
    $t: (key: string, replacements?: Record<string, string | number>) => string
    $formatCurrency: (amount: number | string | null | undefined, options?: CurrencyFormatOptions) => string
    $formatDate: (date: Date | string | number | null | undefined, options?: DateTimeFormatOptions) => string
  }
}

export {}
