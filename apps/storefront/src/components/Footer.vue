<script setup lang="ts">
import { Sparkles, Heart } from "lucide-vue-next"
</script>

<template>
  <footer class="border-t border-neutral-900 bg-neutral-950 text-neutral-400 py-12 text-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="flex items-center gap-2">
        <Sparkles class="w-4 h-4 text-amber-400" />
        <span class="font-serif tracking-widest text-neutral-200 font-bold">MELTIA</span>
        <span class="text-xs text-neutral-500">— Figuras Coleccionables y Blind Boxes Personalizados</span>
      </div>

      <div class="flex items-center gap-1 text-xs text-neutral-500">
        Fabricado con
        <Heart class="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-0.5 inline" />
        en impresión 3D FDM de alta precisión
      </div>

      <div class="text-xs text-neutral-600">
        &copy; {{ new Date().getFullYear() }} Meltia. Todos los derechos reservados.
      </div>
    </div>
  </footer>
</template>
