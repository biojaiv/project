/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#FCF7F7',
          100: '#F5E6E8',
          200: '#E8C7CB',
          300: '#D69AA2',
          400: '#C66D78',
          500: '#B23A4B',
          600: '#8E2F3C',
          700: '#6B232D',
          800: '#47171E',
          900: '#240C0F',
        },
      },
    },
  },
  plugins: [],
};