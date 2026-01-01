/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#F97316',
        'brand-red': '#991B1B',
        'brand-cream': '#FEF3C7',
        'brand-dark': '#1F2937',
      }
    },
  },
  plugins: [],
}