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
          DEFAULT: '#060218',
          card: '#0D0726',
          border: '#1A1033',
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
        display: ['Urbanist', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 35px -5px rgba(160, 104, 255, 0.45)',
        'glow-blue': '0 0 35px -5px rgba(14, 165, 233, 0.4)',
        'glow-success': '0 0 35px -5px rgba(16, 185, 129, 0.4)',
      },
    },
  },
  plugins: [],
}
