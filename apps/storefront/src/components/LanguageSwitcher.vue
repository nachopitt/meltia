<script setup lang="ts">
import { useI18n } from "@/composables/useI18n"

const { locale, setLocale } = useI18n()
</script>

<template>
  <div
    class="inline-flex items-center rounded-lg border border-neutral-800 bg-neutral-950 p-0.5 text-xs font-semibold"
    role="group"
    aria-label="Language selector"
  >
    <button
      id="lang-switch-en"
      type="button"
      @click="setLocale('en')"
      :class="[
        'px-2 py-1 rounded-md transition-colors text-[11px] font-bold uppercase tracking-wider',
        locale === 'en' ? 'bg-amber-400/20 text-amber-300 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
      ]"
      :aria-pressed="locale === 'en'"
    >
      EN
    </button>
    <button
      id="lang-switch-es"
      type="button"
      @click="setLocale('es')"
      :class="[
        'px-2 py-1 rounded-md transition-colors text-[11px] font-bold uppercase tracking-wider',
        locale === 'es' ? 'bg-amber-400/20 text-amber-300 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
      ]"
      :aria-pressed="locale === 'es'"
    >
      ES
    </button>
  </div>
</template>
