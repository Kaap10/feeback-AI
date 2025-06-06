/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0033FF",
        secondary: "#1E40AF",
        accent: "#3B82F6",
      },
      fontFamily: {
        sans: ['HK Protesk Pro', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} 