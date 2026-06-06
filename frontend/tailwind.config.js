/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a5f',
        },
        brand: '#1A365D',
        'risk-green':  '#22C55E',
        'risk-yellow': '#EAB308',
        'risk-red':    '#EF4444',
      }
    }
  },
  plugins: [],
}
