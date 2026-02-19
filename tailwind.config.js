/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sakura: {
          pink: '#FFB7C5',
          light: '#FFF0F3',
          dark: '#E89AAE',
        },
        gold: {
          accent: '#D4AF37',
          light: '#F4E4BA',
        },
        charcoal: '#2D2D2D',
        cream: '#FFFEF9',
      },
      fontFamily: {
        serif: ['"Noto Serif JP"', '"Playfair Display"', 'serif'],
        sans: ['"Inter"', '"Noto Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
