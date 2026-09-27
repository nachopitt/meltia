import type { LocaleCode } from "@/composables/useI18n"

declare module "vue" {
  interface ComponentCustomProperties {
    $t: (key: string, replacements?: Record<string, string | number>) => string
  }
}

export {}
