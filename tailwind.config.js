/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx,md}",
    "vite.config.ts" // to include markdown classes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

