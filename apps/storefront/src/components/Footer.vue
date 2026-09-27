<script setup lang="ts">
import { Sparkles, Heart } from "lucide-vue-next"
import I18nT from "./I18nT.vue"
</script>

<template>
  <footer class="border-t border-neutral-900 bg-neutral-950 text-neutral-400 py-12 text-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="flex items-center gap-2">
        <Sparkles class="w-4 h-4 text-amber-400" />
        <span class="font-serif tracking-widest text-neutral-200 font-bold">MELTIA</span>
        <span class="text-xs text-neutral-500">— {{ $t('Custom 3D Figures & Collectible Blind Boxes') }}</span>
      </div>

      <div class="flex items-center gap-1 text-xs text-neutral-500">
        <I18nT keypath="Crafted with {heart} high-precision FDM 3D printing">
          <template #heart>
            <Heart class="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-0.5 inline" />
          </template>
        </I18nT>
      </div>

      <div class="text-xs text-neutral-600">
        &copy; {{ new Date().getFullYear() }} {{ $t('Meltia. All rights reserved.') }}
      </div>
    </div>
  </footer>
</template>
