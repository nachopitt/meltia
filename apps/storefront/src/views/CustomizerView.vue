<script setup lang="ts">
import { ref } from "vue"
import { useCustomizerStore } from "@/stores/customizer"
import Box3DPreview from "@/components/customizer/Box3DPreview.vue"
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Plus,
  Trash2,
  Upload,
  ShoppingBag,
  Wand2
} from "lucide-vue-next"

const store = useCustomizerStore()

const themes = [
  { id: "celestial-night-gold", name: "Celestial Night Gold", desc: "Midnight blue and celestial gold foil" },
  { id: "pastel-dream-clouds", name: "Pastel Dream Clouds", desc: "Soft lilacs and dreamy cotton clouds" },
  { id: "vintage-rose-garden", name: "Vintage Rose Garden", desc: "Victorian botanical roses and parchment" },
  { id: "cyber-neon-arcade", name: "Cyber Neon Arcade", desc: "Cyan and magenta retro arcade grid" },
  { id: "terracotta-sunset", name: "Terracotta Sunset", desc: "Warm clay tones and bohemian arch accents" },
  { id: "enchanted-forest-emerald", name: "Enchanted Forest Emerald", desc: "Deep emerald green and golden ferns" },
  { id: "monochrome-noir-minimal", name: "Monochrome Noir Minimal", desc: "Matte black and high-contrast typography" },
  { id: "festive-confetti-party", name: "Festive Confetti Party", desc: "Golden glitter confetti and celebration ribbons" }
]

const bodyCatalog = {
  man: [
    { code: "MAN_SUIT_01", name: "Elias Formal (Tailored Suit)", icon: "👔" },
    { code: "MAN_CASUAL_02", name: "Elias Casual (Shirt & Chinos)", icon: "👕" },
    { code: "MAN_SPORT_03", name: "Lupe Athletic (Tennis & Racket)", icon: "🎾" },
    { code: "MAN_MARTIAL_04", name: "Chacos Gi (Karate Uniform)", icon: "🥋" }
  ],
  woman: [
    { code: "WOMAN_GOWN_01", name: "Gala Emerald (Evening Gown)", icon: "👗" },
    { code: "WOMAN_CASUAL_02", name: "Sofia Casual (Knit Sweater & Jeans)", icon: "👚" },
    { code: "WOMAN_SPORT_03", name: "Valeria Active (Top & Leggings)", icon: "🏃‍♀️" },
    { code: "WOMAN_SUIT_04", name: "Daniela Executive (Power Suit)", icon: "💼" }
  ],
  boy: [
    { code: "BOY_CASUAL_01", name: "Leo Casual (Tee & Denim)", icon: "👦" },
    { code: "BOY_SPORT_02", name: "Mateo Soccer (Team Uniform)", icon: "⚽" },
    { code: "BOY_SCHOOL_03", name: "Santi Academy (School Blazer)", icon: "🎒" },
    { code: "BOY_HOODIE_04", name: "Bruno Street (Urban Hoodie)", icon: "🧢" }
  ],
  girl: [
    { code: "GIRL_DRESS_01", name: "Mia Party (Floral Sundress)", icon: "👧" },
    { code: "GIRL_CASUAL_02", name: "Emma Casual (Denim Overalls)", icon: "🌸" },
    { code: "GIRL_BALLET_03", name: "Renata Ballet (Pink Tutu)", icon: "🩰" },
    { code: "GIRL_SPORTS_04", name: "Ximena Gym (Tracksuit)", icon: "🤸‍♀️" }
  ]
}

const filamentPalettes = {
  skin: ["Light Peach (PEACH_01)", "Warm Sand (WARM_02)", "Bronze Tan (BRONZE_03)", "Deep Espresso (DEEP_04)"],
  hair: ["Dark Brown", "Jet Black", "Golden Blonde", "Auburn / Red", "Ash Gray"],
  clothes: ["Charcoal Black", "Navy Blue", "Emerald Green", "Pure White", "Ruby Red", "Heather Gray"]
}

function handleFileUpload(event: Event, target: "main" | number) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      if (target === "main") {
        store.mainCharacter.photoUrl = url
      } else {
        store.rosterCharacters[target].photoUrl = url
      }
    }
    reader.readAsDataURL(file)
  }
}

function triggerAiScene() {
  store.isGeneratingAi = true
  setTimeout(() => {
    store.aiSceneUrl = "/assets/previews/celestial-night-gold.png"
    store.isGeneratingAi = false
  }, 1500)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Header with Steps Progress -->
    <div class="mb-10">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-3xl font-serif font-bold text-neutral-100">Collectible Blind Box Customizer</h1>
          <p class="text-sm text-neutral-400">Step {{ store.currentStep }} of 8 — Design your custom collectible piece</p>
        </div>
        <div class="text-right">
          <div class="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Estimated Total</div>
          <div class="text-2xl font-serif font-bold text-amber-400">${{ store.totalPrice }} MXN</div>
        </div>
      </div>

      <!-- Step Indicator Bar -->
      <div class="grid grid-cols-8 gap-2">
        <button
          v-for="stepNum in 8"
          :key="stepNum"
          @click="store.setStep(stepNum)"
          class="h-2 rounded-full transition-all duration-300"
          :class="[
            stepNum === store.currentStep
              ? 'bg-amber-400 ring-2 ring-amber-400/30'
              : stepNum < store.currentStep
              ? 'bg-amber-600/80'
              : 'bg-neutral-800'
          ]"
        ></button>
      </div>
    </div>

    <!-- Main Grid: Left Controls, Right Preview -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      <!-- WIZARD STEP FORM (7 cols) -->
      <div class="lg:col-span-7 bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8">
        <!-- STEP 1: THEME -->
        <div v-if="store.currentStep === 1">
          <h2 class="text-xl font-serif font-bold text-neutral-100 mb-1">1. Select Box Packaging Theme</h2>
          <p class="text-sm text-neutral-400 mb-6">Choose the visual aesthetic for your folding box dieline packaging.</p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              v-for="theme in themes"
              :key="theme.id"
              @click="store.selectedTheme = theme.id"
              :class="[
                'p-4 rounded-xl border text-left transition-all',
                store.selectedTheme === theme.id
                  ? 'border-amber-400 bg-amber-500/10 shadow-sm'
                  : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
              ]"
            >
              <div class="flex items-center justify-between mb-1">
                <span class="font-serif font-bold text-neutral-100 text-sm">{{ theme.name }}</span>
                <Check v-if="store.selectedTheme === theme.id" class="w-4 h-4 text-amber-400" />
              </div>
              <p class="text-xs text-neutral-400">{{ theme.desc }}</p>
            </button>
          </div>
        </div>

        <!-- STEP 2: TITLE -->
        <div v-else-if="store.currentStep === 2">
          <h2 class="text-xl font-serif font-bold text-neutral-100 mb-1">2. Collection Series Title</h2>
          <p class="text-sm text-neutral-400 mb-6">The headline featured on the top ribbon banner and front display panel.</p>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Series Headline (e.g. AGUSTIN FAMILY, ELIAS & SOFIA, MORA COLLECTION)
              </label>
              <input
                v-model="store.collectionTitle"
                type="text"
                maxlength="30"
                class="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-neutral-100 font-serif text-lg focus:outline-none focus:border-amber-400 transition-colors"
                placeholder="Enter your series headline..."
              />
              <span class="text-xs text-neutral-500 mt-1 block">Maximum 30 characters. Automatically formatted on the top box marquee.</span>
            </div>
          </div>
        </div>

        <!-- STEP 3: MAIN CHARACTER -->
        <div v-else-if="store.currentStep === 3">
          <h2 class="text-xl font-serif font-bold text-neutral-100 mb-1">3. Lead Character Customization</h2>
          <p class="text-sm text-neutral-400 mb-6">Customize the signature 3D figure featured on the primary front panel.</p>

          <div class="space-y-6">
            <!-- Name & Category -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-neutral-300 mb-1.5">Character Name</label>
                <input
                  v-model="store.mainCharacter.name"
                  type="text"
                  class="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-neutral-300 mb-1.5">Category</label>
                <div class="grid grid-cols-4 gap-1">
                  <button
                    v-for="cat in (['man', 'woman', 'boy', 'girl'] as const)"
                    :key="cat"
                    @click="store.mainCharacter.category = cat"
                    :class="[
                      'py-2 text-xs font-semibold uppercase rounded-lg border transition-colors',
                      store.mainCharacter.category === cat
                        ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400'
                    ]"
                  >
                    {{ cat }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Body Selection -->
            <div>
              <label class="block text-xs font-semibold text-neutral-300 mb-2">Body Archetype (FDM 3D Print)</label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  v-for="body in bodyCatalog[store.mainCharacter.category]"
                  :key="body.code"
                  @click="store.mainCharacter.bodyCode = body.code"
                  :class="[
                    'p-3 rounded-lg border text-left flex items-center gap-3 transition-colors',
                    store.mainCharacter.bodyCode === body.code
                      ? 'border-amber-400 bg-amber-500/10 text-neutral-100'
                      : 'border-neutral-800 bg-neutral-950/80 text-neutral-400 hover:border-neutral-700'
                  ]"
                >
                  <span class="text-xl">{{ body.icon }}</span>
                  <div class="flex flex-col">
                    <span class="text-xs font-bold text-neutral-200">{{ body.name }}</span>
                    <span class="text-[10px] text-amber-400/90 font-mono">{{ body.code }}</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Photo Upload for Head -->
            <div>
              <label class="block text-xs font-semibold text-neutral-300 mb-2">Portrait Photo for Custom Chibi Head</label>
              <div class="border-2 border-dashed border-neutral-700 hover:border-amber-400/60 rounded-xl p-4 text-center cursor-pointer transition-colors relative">
                <input
                  type="file"
                  accept="image/*"
                  class="absolute inset-0 opacity-0 cursor-pointer"
                  @change="(e) => handleFileUpload(e, 'main')"
                />
                <div class="flex flex-col items-center gap-1.5">
                  <Upload class="w-6 h-6 text-amber-400 mb-1" />
                  <span class="text-xs font-medium text-neutral-200">Upload a clear front-facing portrait</span>
                  <span class="text-[10px] text-neutral-500">JPG, PNG with clear lighting and neutral expression</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 4: EXTRA CHARACTERS -->
        <div v-else-if="store.currentStep === 4">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-xl font-serif font-bold text-neutral-100 mb-1">4. Collection Companions</h2>
              <p class="text-sm text-neutral-400">Add companion figures (partner, children, pets) to complete your roster.</p>
            </div>
            <button
              @click="store.addRosterCharacter('woman')"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/30 text-xs font-bold hover:bg-amber-400/20 transition-colors"
            >
              <Plus class="w-3.5 h-3.5" />
              Add Companion (+${{ store.extraFigurePrice }} MXN)
            </button>
          </div>

          <div v-if="store.rosterCharacters.length === 0" class="text-center py-8 bg-neutral-950/60 rounded-xl border border-neutral-800 text-neutral-500 text-xs">
            No companion figures added yet. Only the lead character will be included.
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(char, idx) in store.rosterCharacters"
              :key="idx"
              class="p-4 rounded-xl border border-neutral-800 bg-neutral-950/80 flex flex-col gap-3"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-neutral-200 font-serif">Companion #{{ idx + 1 }}</span>
                <button @click="store.removeRosterCharacter(idx)" class="text-red-400 hover:text-red-300 p-1">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <input
                  v-model="char.name"
                  type="text"
                  placeholder="Name"
                  class="bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-100"
                />
                <select
                  v-model="char.category"
                  class="bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-100"
                >
                  <option value="man">Man</option>
                  <option value="woman">Woman</option>
                  <option value="boy">Boy</option>
                  <option value="girl">Girl</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 5: DEDICATION -->
        <div v-else-if="store.currentStep === 5">
          <h2 class="text-xl font-serif font-bold text-neutral-100 mb-1">5. Dedication Letter</h2>
          <p class="text-sm text-neutral-400 mb-6">Printed on the right side panel and companion card in elegant calligraphic script.</p>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-neutral-300 mb-1">Dedication Headline</label>
              <input
                v-model="store.dedicationHeadline"
                type="text"
                class="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-serif"
                placeholder="e.g. Happy 28th My Love, To the Best Dad..."
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-neutral-300 mb-1">Dedication Message Body</label>
              <textarea
                v-model="store.dedicationBody"
                rows="4"
                class="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-3 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 leading-relaxed font-serif"
                placeholder="Write your personal heartfelt dedication here..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- STEP 6: AI SCENE -->
        <div v-else-if="store.currentStep === 6">
          <h2 class="text-xl font-serif font-bold text-neutral-100 mb-1">6. AI Scene Illustration</h2>
          <p class="text-sm text-neutral-400 mb-6">Generate a custom illustration of your characters posing together for the side panel.</p>

          <div class="bg-neutral-950 p-6 rounded-xl border border-neutral-800 text-center flex flex-col items-center">
            <div class="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <Wand2 class="w-8 h-8" />
            </div>
            <h3 class="text-base font-serif font-bold text-neutral-100 mb-2">Embracing Scene Synthesis</h3>
            <p class="text-xs text-neutral-400 max-w-sm mb-6">
              Meltia AI synthesizes your selected archetypes, outfits, and portraits into a cohesive artwork of the characters posing together.
            </p>

            <button
              @click="triggerAiScene"
              :disabled="store.isGeneratingAi"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-neutral-950 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md"
            >
              <Sparkles class="w-4 h-4" />
              {{ store.isGeneratingAi ? 'Synthesizing AI Artwork...' : 'Generate AI Scene Preview' }}
            </button>
          </div>
        </div>

        <!-- STEP 7: REVIEW -->
        <div v-else-if="store.currentStep === 7">
          <h2 class="text-xl font-serif font-bold text-neutral-100 mb-1">7. Order Review</h2>
          <p class="text-sm text-neutral-400 mb-6">Verify all specifications before adding to your shopping cart.</p>

          <div class="space-y-3 text-sm">
            <div class="flex justify-between py-2 border-b border-neutral-800">
              <span class="text-neutral-400">Packaging Theme:</span>
              <span class="font-serif font-semibold text-neutral-100 capitalize">{{ store.selectedTheme.replace(/-/g, ' ') }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-neutral-800">
              <span class="text-neutral-400">Series Headline:</span>
              <span class="font-serif font-bold text-amber-400">{{ store.collectionTitle }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-neutral-800">
              <span class="text-neutral-400">Lead Figure:</span>
              <span class="text-neutral-100">{{ store.mainCharacter.name }} ({{ store.mainCharacter.bodyCode }})</span>
            </div>
            <div class="flex justify-between py-2 border-b border-neutral-800">
              <span class="text-neutral-400">Additional Figures:</span>
              <span class="text-neutral-100">{{ store.rosterCharacters.length }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-neutral-800">
              <span class="text-neutral-400">Dedication:</span>
              <span class="text-neutral-100 truncate max-w-xs">{{ store.dedicationHeadline }}</span>
            </div>
          </div>
        </div>

        <!-- STEP 8: CHECKOUT / CART -->
        <div v-else-if="store.currentStep === 8">
          <h2 class="text-xl font-serif font-bold text-neutral-100 mb-1">8. Ready for Production</h2>
          <p class="text-sm text-neutral-400 mb-6">Your order will immediately compile workshop filament assembly sheets and print-ready 300 DPI dielines.</p>

          <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-6">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm text-neutral-200">1x Collectible Blind Box ({{ store.collectionTitle }})</span>
              <span class="font-serif font-bold text-amber-300">${{ store.totalPrice }} MXN</span>
            </div>
            <p class="text-xs text-neutral-400">
              Includes custom author folding box + {{ 1 + store.rosterCharacters.length }} custom 3D chibi figures + companion trading card.
            </p>
          </div>

          <button
            class="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-neutral-950 font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:opacity-95 transition-opacity"
          >
            <ShoppingBag class="w-5 h-5" />
            Add to Cart & Proceed to Checkout
          </button>
        </div>

        <!-- STEP NAVIGATION BUTTONS -->
        <div class="mt-8 pt-6 border-t border-neutral-800/80 flex items-center justify-between">
          <button
            v-if="store.currentStep > 1"
            @click="store.prevStep"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <ChevronLeft class="w-4 h-4" />
            Previous
          </button>
          <div v-else></div>

          <button
            v-if="store.currentStep < 8"
            @click="store.nextStep"
            class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            Next
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- LIVE 3D/PANEL PREVIEW (5 cols, sticky) -->
      <div class="lg:col-span-5 sticky top-24">
        <Box3DPreview />
      </div>
    </div>
  </div>
</template>
