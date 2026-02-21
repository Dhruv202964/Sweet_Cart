/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-red': '#8B1A1A',
        'brand-saffron': '#F4A460',
      },
    },
  },
  plugins: [],
}