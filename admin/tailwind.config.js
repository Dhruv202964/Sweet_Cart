/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#F97316', // Saffron (Jalebi)
        'brand-red': '#991B1B',    // Deep Royal Red
        'brand-cream': '#FEF3C7',  // Warm Background
        'brand-dark': '#1F2937',   // Text
      }
    },
  },
  plugins: [],
}