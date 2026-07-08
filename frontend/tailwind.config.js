/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0B0B0F',
          card: '#12121A',
          border: '#1F1F2E',
          text: '#F3F4F6',
          muted: '#9CA3AF',
        },
        brand: {
          purple: '#6366F1',
          blue: '#0EA5E9',
          success: '#10B981', // YES
          danger: '#EF4444',  // NO
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
