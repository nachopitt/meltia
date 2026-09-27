import Medusa from "@medusajs/js-sdk"

export const medusa = new Medusa({
  baseUrl: import.meta.env.VITE_MEDUSA_BACKEND_URL || "http://localhost:8080",
  publishableKey: import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || "pk_e948efee71591f079be63002159c43bc8a560fdc738a3d0afa0cb3b3021d9361"
})
