<script setup lang="ts">
import { RouterLink } from "vue-router"
import { Sparkles, ShoppingBag } from "lucide-vue-next"
import LanguageSwitcher from "./LanguageSwitcher.vue"
</script>

<template>
  <header class="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <RouterLink to="/" class="flex items-center gap-3 group">
        <div class="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 p-[1px] shadow-sm">
          <div class="w-full h-full bg-neutral-950 rounded-lg flex items-center justify-center">
            <Sparkles class="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </div>
        <div class="flex flex-col">
          <span class="font-serif tracking-widest text-lg font-bold text-neutral-100 group-hover:text-amber-400 transition-colors">
            MELTIA
          </span>
          <span class="text-[9px] tracking-widest uppercase text-amber-500/80 -mt-1 font-medium">
            {{ $t('Eternal Moments') }}
          </span>
        </div>
      </RouterLink>

      <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
        <RouterLink to="/" class="hover:text-neutral-100 transition-colors">{{ $t('Home') }}</RouterLink>
        <RouterLink to="/customizer" class="hover:text-neutral-100 transition-colors">{{ $t('Customizer') }}</RouterLink>
        <RouterLink :to="{ path: '/', hash: '#how-it-works' }" class="hover:text-neutral-100 transition-colors">{{ $t('How It Works') }}</RouterLink>
      </nav>

      <div class="flex items-center gap-4">
        <LanguageSwitcher />

        <RouterLink
          to="/customizer"
          class="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-950 bg-gradient-to-r from-amber-400 to-amber-300 rounded-full hover:from-amber-300 hover:to-amber-200 transition-all shadow-md shadow-amber-500/20 active:scale-95"
        >
          <Sparkles class="w-3.5 h-3.5" />
          {{ $t('Design Blind Box') }}
        </RouterLink>

        <button class="relative p-2 text-neutral-400 hover:text-neutral-100 transition-colors" :aria-label="$t('Cart')">
          <ShoppingBag class="w-5 h-5" />
          <span class="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full"></span>
        </button>
      </div>
    </div>
  </header>
</template>
