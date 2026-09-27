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
          Handcrafted 3D Collectible Blind Boxes
        </div>

        <h1 class="text-4xl sm:text-6xl font-serif font-bold text-neutral-100 tracking-tight leading-tight">
          Immortalize Your Moments in a
          <span class="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
            Collectible Blind Box
          </span>
        </h1>

        <p class="mt-6 text-lg text-neutral-400 leading-relaxed max-w-2xl mx-auto">
          Design your custom chibi 3D figures printed with curated filaments, packaged inside a collector box with personal dedication, companion trading card, and AI scene illustration.
        </p>

        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <RouterLink
            to="/customizer"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-neutral-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 transition-all shadow-lg shadow-amber-500/25 active:scale-95"
          >
            <Sparkles class="w-4 h-4" />
            Design Your Blind Box
            <ArrowRight class="w-4 h-4" />
          </RouterLink>

          <RouterLink
            :to="{ path: '/', hash: '#how-it-works' }"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors"
          >
            How It Works
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Value Props / Feature Grid -->
    <section id="how-it-works" class="py-20 bg-neutral-900/40 border-y border-neutral-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-xs uppercase font-bold tracking-widest text-amber-400 mb-2">Craft & Technology Process</h2>
          <p class="text-3xl font-serif font-bold text-neutral-100">How Your Meltia Comes to Life</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-neutral-950 border border-neutral-800/80 rounded-2xl p-8 flex flex-col items-start relative group hover:border-amber-500/40 transition-colors">
            <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
              <Box class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-serif font-bold text-neutral-100 mb-2">1. Choose Your Box & Title</h3>
            <p class="text-sm text-neutral-400 leading-relaxed">
              Select from 8 signature templates (celestial night, pastel clouds, retro arcade, vintage rose) and title your collection with your name or family.
            </p>
          </div>

          <div class="bg-neutral-950 border border-neutral-800/80 rounded-2xl p-8 flex flex-col items-start relative group hover:border-amber-500/40 transition-colors">
            <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
              <Palette class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-serif font-bold text-neutral-100 mb-2">2. Customize 3D Figures</h3>
            <p class="text-sm text-neutral-400 leading-relaxed">
              Choose body archetypes from our catalog (men, women, boys, girls), upload portrait photos, and select exact filament colors.
            </p>
          </div>

          <div class="bg-neutral-950 border border-neutral-800/80 rounded-2xl p-8 flex flex-col items-start relative group hover:border-amber-500/40 transition-colors">
            <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
              <HeartHandshake class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-serif font-bold text-neutral-100 mb-2">3. Dedication & AI Art</h3>
            <p class="text-sm text-neutral-400 leading-relaxed">
              Write a heartfelt dedication note for the side panel and generate an AI illustration of your characters embracing for the packaging.
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
          <span>Premium FDM Filaments</span>
        </div>
        <div class="flex items-center justify-center gap-3">
          <Truck class="w-5 h-5 text-amber-400" />
          <span>Secure Nationwide Shipping</span>
        </div>
        <div class="flex items-center justify-center gap-3">
          <ShieldCheck class="w-5 h-5 text-amber-400" />
          <span>100% Meltia Satisfaction Guarantee</span>
        </div>
      </div>
    </section>
  </div>
</template>
