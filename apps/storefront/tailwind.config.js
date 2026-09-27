/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Cinzel", "serif"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        meltia: {
          gold: "#D4AF37",
          navy: "#0a1128",
          dark: "#050814",
          card: "#121a36",
          border: "#1f2b52"
        }
      }
    },
  },
  plugins: [],
}
