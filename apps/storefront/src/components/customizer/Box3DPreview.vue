<script setup lang="ts">
import { ref } from "vue"
import { useCustomizerStore } from "@/stores/customizer"
import { Sparkles, Eye, RotateCw } from "lucide-vue-next"

const store = useCustomizerStore()
const activeFace = ref<"front" | "left" | "right" | "back">("front")
</script>

<template>
  <div class="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center">
    <div class="w-full flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <Sparkles class="w-4 h-4 text-amber-400" />
        <span class="text-xs uppercase tracking-widest font-semibold text-neutral-300">
          Vista Previa de Blind Box
        </span>
      </div>

      <!-- Face Selectors -->
      <div class="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs">
        <button
          @click="activeFace = 'front'"
          :class="[
            'px-2.5 py-1 rounded transition-colors',
            activeFace === 'front' ? 'bg-amber-400/20 text-amber-300 font-medium' : 'text-neutral-400 hover:text-neutral-200'
          ]"
        >
          Frente
        </button>
        <button
          @click="activeFace = 'left'"
          :class="[
            'px-2.5 py-1 rounded transition-colors',
            activeFace === 'left' ? 'bg-amber-400/20 text-amber-300 font-medium' : 'text-neutral-400 hover:text-neutral-200'
          ]"
        >
          Lateral IA
        </button>
        <button
          @click="activeFace = 'right'"
          :class="[
            'px-2.5 py-1 rounded transition-colors',
            activeFace === 'right' ? 'bg-amber-400/20 text-amber-300 font-medium' : 'text-neutral-400 hover:text-neutral-200'
          ]"
        >
          Dedicatoria
        </button>
        <button
          @click="activeFace = 'back'"
          :class="[
            'px-2.5 py-1 rounded transition-colors',
            activeFace === 'back' ? 'bg-amber-400/20 text-amber-300 font-medium' : 'text-neutral-400 hover:text-neutral-200'
          ]"
        >
          Reverso
        </button>
      </div>
    </div>

    <!-- The Box Mockup Container -->
    <div class="relative w-64 h-[380px] rounded-xl overflow-hidden shadow-2xl border-2 border-amber-500/40 bg-[#070e24] flex flex-col justify-between p-4 transition-all duration-300">
      <!-- Background Celestial Artwork Effect -->
      <div class="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-300/30 via-sky-900/40 to-transparent pointer-events-none"></div>

      <!-- Ornate Gold Border Line -->
      <div class="absolute inset-2 border border-amber-400/30 rounded-lg pointer-events-none"></div>

      <!-- FACE: FRONT -->
      <template v-if="activeFace === 'front'">
        <!-- Top Ribbon Title Banner -->
        <div class="relative z-10 text-center pt-2">
          <div class="inline-block bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 px-4 py-1 rounded-sm shadow-md border-y border-amber-200/50">
            <span class="font-serif font-black tracking-wider text-neutral-950 text-sm uppercase block truncate max-w-[190px]">
              {{ store.collectionTitle || 'TITULO' }}
            </span>
          </div>
          <span class="text-[8px] tracking-[0.2em] uppercase text-amber-300 font-bold block mt-0.5">
            ✦ COLLECTIBLE BLIND BOX ✦
          </span>
        </div>

        <!-- Center Figure Illustration -->
        <div class="relative z-10 flex-1 flex flex-col items-center justify-center my-2">
          <div class="w-32 h-44 rounded-xl bg-neutral-950/60 border border-amber-400/20 flex flex-col items-center justify-center p-2 relative overflow-hidden shadow-inner">
            <div class="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-400/40 flex items-center justify-center mb-1 overflow-hidden">
              <img
                v-if="store.mainCharacter.photoUrl"
                :src="store.mainCharacter.photoUrl"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-3xl">👤</span>
            </div>
            <div class="text-[11px] font-bold text-neutral-100 font-serif">{{ store.mainCharacter.name }}</div>
            <div class="text-[9px] text-amber-400 font-mono">{{ store.mainCharacter.bodyCode }}</div>
            <div class="text-[8px] text-neutral-400 capitalize mt-0.5">
              {{ store.mainCharacter.category }} · {{ store.mainCharacter.clothingFilament }}
            </div>
          </div>
        </div>

        <!-- Bottom Meltia Branding -->
        <div class="relative z-10 text-center pb-1">
          <span class="font-serif tracking-widest text-xs font-bold text-neutral-200">MELTIA</span>
          <div class="text-[8px] tracking-widest uppercase text-amber-400/80 -mt-0.5 font-medium">Instantes Eternos</div>
        </div>
      </template>

      <!-- FACE: LEFT (AI Group Scene) -->
      <template v-else-if="activeFace === 'left'">
        <div class="relative z-10 text-center pt-2">
          <span class="text-[9px] tracking-widest uppercase text-amber-300 font-bold block">
            ESCENA PERSONALIZADA IA
          </span>
        </div>
        <div class="relative z-10 flex-1 flex flex-col items-center justify-center p-2">
          <div class="w-48 h-56 rounded-lg bg-neutral-950/80 border border-amber-400/30 flex flex-col items-center justify-center text-center p-3 relative overflow-hidden">
            <img v-if="store.aiSceneUrl" :src="store.aiSceneUrl" class="w-full h-full object-cover rounded" />
            <div v-else class="flex flex-col items-center gap-2">
              <span class="text-4xl">✨</span>
              <p class="text-[10px] text-amber-200/90 font-serif leading-tight">
                Ilustración generada por IA: Personajes abrazados en estilo chibi blind box
              </p>
            </div>
          </div>
        </div>
        <div class="relative z-10 text-center pb-1 text-[8px] text-neutral-400">
          Panel Lateral Izquierdo
        </div>
      </template>

      <!-- FACE: RIGHT (Dedication Letter) -->
      <template v-else-if="activeFace === 'right'">
        <div class="relative z-10 text-center pt-2">
          <h4 class="font-serif text-sm font-bold text-amber-300 leading-tight">
            {{ store.dedicationHeadline || 'Dedicatoria' }}
          </h4>
        </div>
        <div class="relative z-10 flex-1 flex items-center justify-center p-3">
          <p class="text-[10px] font-serif italic text-neutral-200 leading-relaxed text-center overflow-y-auto max-h-48 scrollbar-thin">
            "{{ store.dedicationBody }}"
          </p>
        </div>
        <div class="relative z-10 text-center pb-1 text-[8px] text-amber-400 font-serif">
          ♥ Con todo mi amor ♥
        </div>
      </template>

      <!-- FACE: BACK (Roster or Partner) -->
      <template v-else-if="activeFace === 'back'">
        <div class="relative z-10 text-center pt-2">
          <span class="text-[9px] tracking-widest uppercase text-amber-300 font-bold block">
            COLECCIÓN · BLIND BOX SERIES
          </span>
        </div>
        <div class="relative z-10 flex-1 flex flex-col items-center justify-center my-1">
          <div class="grid grid-cols-2 gap-2 w-full px-2">
            <!-- Main figure small -->
            <div class="bg-neutral-950/60 border border-amber-400/20 rounded p-1.5 flex flex-col items-center text-center">
              <span class="text-lg">👤</span>
              <span class="text-[9px] font-bold text-neutral-100 truncate w-full">{{ store.mainCharacter.name }}</span>
              <span class="text-[7px] text-amber-400">Principal</span>
            </div>
            <!-- Extra figures -->
            <div
              v-for="(fig, idx) in store.rosterCharacters"
              :key="idx"
              class="bg-neutral-950/60 border border-amber-400/20 rounded p-1.5 flex flex-col items-center text-center"
            >
              <span class="text-lg">✨</span>
              <span class="text-[9px] font-bold text-neutral-100 truncate w-full">{{ fig.name }}</span>
              <span class="text-[7px] text-amber-400 font-mono">{{ fig.bodyCode }}</span>
            </div>
          </div>
        </div>
        <div class="relative z-10 text-center pb-1 text-[8px] text-neutral-400">
          {{ 1 + store.rosterCharacters.length }} Figuras en esta colección
        </div>
      </template>
    </div>

    <!-- Companion Collectible Card Preview -->
    <div class="mt-4 flex items-center gap-3 bg-neutral-950/90 border border-amber-500/20 px-4 py-2.5 rounded-xl w-full max-w-xs">
      <div class="w-8 h-12 rounded bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-sm shadow-sm">
        🃏
      </div>
      <div class="flex flex-col">
        <span class="text-xs font-serif font-bold text-neutral-200">Tarjeta Coleccionable Incluida</span>
        <span class="text-[10px] text-amber-400/80">Impresa a doble cara con arte exclusivo</span>
      </div>
    </div>
  </div>
</template>
