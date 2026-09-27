<script setup lang="ts">
import { RouterLink } from "vue-router"
import { Sparkles, Box, Palette, HeartHandshake, ArrowRight, ShieldCheck, Truck, Layers } from "lucide-vue-next"
</script>

<template>
  <div class="relative overflow-hidden">
    <!-- Hero Section -->
    <section class="relative pt-20 pb-24 md:pt-32 md:pb-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="text-center max-w-3xl mx-auto">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles class="w-3.5 h-3.5" />
          Figuras 3D en Caja Coleccionable de Autor
        </div>

        <h1 class="text-4xl sm:text-6xl font-serif font-bold text-neutral-100 tracking-tight leading-tight">
          Inmortaliza tus momentos en un
          <span class="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
            Collectible Blind Box
          </span>
        </h1>

        <p class="mt-6 text-lg text-neutral-400 leading-relaxed max-w-2xl mx-auto">
          Diseña paso a paso tus figuras estilo chibi impresas en 3D con filamentos seleccionados, dentro de una caja de colección con dedicatoria personalizada, tarjeta de colección y arte generado con IA.
        </p>

        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <RouterLink
            to="/customizer"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-neutral-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 transition-all shadow-lg shadow-amber-500/25 active:scale-95"
          >
            <Sparkles class="w-4 h-4" />
            Diseñar Mi Blind Box Ahora
            <ArrowRight class="w-4 h-4" />
          </RouterLink>

          <a
            href="#proceso"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors"
          >
            Ver Cómo Funciona
          </a>
        </div>
      </div>
    </section>

    <!-- Value Props / Feature Grid -->
    <section id="proceso" class="py-20 bg-neutral-900/40 border-y border-neutral-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-xs uppercase font-bold tracking-widest text-amber-400 mb-2">Proceso Artesanal & Tecnológico</h2>
          <p class="text-3xl font-serif font-bold text-neutral-100">Cómo cobra vida tu Meltia</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-neutral-950 border border-neutral-800/80 rounded-2xl p-8 flex flex-col items-start relative group hover:border-amber-500/40 transition-colors">
            <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
              <Box class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-serif font-bold text-neutral-100 mb-2">1. Elige tu Caja y Título</h3>
            <p class="text-sm text-neutral-400 leading-relaxed">
              Selecciona entre 8 plantillas de autor (noche celestial, tonos pastel, arcade, vintage) y bautiza tu colección con tu nombre o familia.
            </p>
          </div>

          <div class="bg-neutral-950 border border-neutral-800/80 rounded-2xl p-8 flex flex-col items-start relative group hover:border-amber-500/40 transition-colors">
            <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
              <Palette class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-serif font-bold text-neutral-100 mb-2">2. Modela tus Personajes 3D</h3>
            <p class="text-sm text-neutral-400 leading-relaxed">
              Escoge los cuerpos de nuestro catálogo (hombres, mujeres, niños), sube la foto de sus rostros y selecciona colores exactos de filamento.
            </p>
          </div>

          <div class="bg-neutral-950 border border-neutral-800/80 rounded-2xl p-8 flex flex-col items-start relative group hover:border-amber-500/40 transition-colors">
            <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
              <HeartHandshake class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-serif font-bold text-neutral-100 mb-2">3. Dedicatoria & Arte IA</h3>
            <p class="text-sm text-neutral-400 leading-relaxed">
              Escribe una carta emotiva para el panel lateral e incluye una ilustración generada por IA de tus personajes abrazados para el empaque.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust Badges -->
    <section class="py-12 border-b border-neutral-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-sm text-neutral-400">
        <div class="flex items-center justify-center gap-3">
          <Layers class="w-5 h-5 text-amber-400" />
          <span>Filamentos FDM de Calidad Premium</span>
        </div>
        <div class="flex items-center justify-center gap-3">
          <Truck class="w-5 h-5 text-amber-400" />
          <span>Envíos Seguros a Todo México</span>
        </div>
        <div class="flex items-center justify-center gap-3">
          <ShieldCheck class="w-5 h-5 text-amber-400" />
          <span>Garantía de Satisfacción Meltia</span>
        </div>
      </div>
    </section>
  </div>
</template>
