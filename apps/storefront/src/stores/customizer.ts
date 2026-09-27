import { defineStore } from "pinia"
import { ref, computed } from "vue"

export interface CharacterConfig {
  name: string
  category: "man" | "woman" | "boy" | "girl"
  bodyCode: string
  skinFilament: string
  hairFilament: string
  clothingFilament: string
  photoUrl: string | null
  croppedPhotoUrl: string | null
}

export const useCustomizerStore = defineStore("customizer", () => {
  const currentStep = ref(1)

  // Step 1: Box Theme
  const selectedTheme = ref("celestial-night-gold")

  // Step 2: Collection Title
  const collectionTitle = ref("FAM. AGUSTÍN")

  // Step 3: Main Character
  const mainCharacter = ref<CharacterConfig>({
    name: "Elias",
    category: "man",
    bodyCode: "MAN_SUIT_01",
    skinFilament: "PEACH_01",
    hairFilament: "DARK_BROWN",
    clothingFilament: "CHARCOAL_BLACK",
    photoUrl: null,
    croppedPhotoUrl: null
  })

  // Step 4: Additional Roster Characters
  const rosterCharacters = ref<CharacterConfig[]>([
    {
      name: "Sofia",
      category: "woman",
      bodyCode: "WOMAN_GOWN_01",
      skinFilament: "PEACH_01",
      hairFilament: "AUBURN_CURLS",
      clothingFilament: "EMERALD_GREEN",
      photoUrl: null,
      croppedPhotoUrl: null
    }
  ])

  const backPanelMode = ref<"roster_grid" | "dual_showcase">("dual_showcase")

  // Step 5: Dedication Letter
  const dedicationHeadline = ref("Happy 28th My Love")
  const dedicationBody = ref(
    "Today I celebrate the wonderful person you are and thank life for allowing me to cross paths and share part of this beautiful journey with you. May this new trip around the sun be filled with joy, adventures, and moments that make your heart smile. I love you."
  )

  // Step 6: AI Generated Scene
  const aiSceneUrl = ref<string | null>(null)
  const isGeneratingAi = ref(false)

  // Pricing calculation
  const basePrice = 850 // MXN for box + main figure
  const extraFigurePrice = 350 // MXN per extra figure

  const totalPrice = computed(() => {
    return basePrice + rosterCharacters.value.length * extraFigurePrice
  })

  function nextStep() {
    if (currentStep.value < 8) currentStep.value++
  }

  function prevStep() {
    if (currentStep.value > 1) currentStep.value--
  }

  function setStep(step: number) {
    if (step >= 1 && step <= 8) currentStep.value = step
  }

  function addRosterCharacter(category: "man" | "woman" | "boy" | "girl" = "boy") {
    rosterCharacters.value.push({
      name: `Companion ${rosterCharacters.value.length + 2}`,
      category,
      bodyCode: category === "man" ? "MAN_CASUAL_02" : "BOY_CASUAL_01",
      skinFilament: "PEACH_01",
      hairFilament: "BLACK",
      clothingFilament: "NAVY_BLUE",
      photoUrl: null,
      croppedPhotoUrl: null
    })
  }

  function removeRosterCharacter(index: number) {
    rosterCharacters.value.splice(index, 1)
  }

  return {
    currentStep,
    selectedTheme,
    collectionTitle,
    mainCharacter,
    rosterCharacters,
    backPanelMode,
    dedicationHeadline,
    dedicationBody,
    aiSceneUrl,
    isGeneratingAi,
    basePrice,
    extraFigurePrice,
    totalPrice,
    nextStep,
    prevStep,
    setStep,
    addRosterCharacter,
    removeRosterCharacter
  }
})
