/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,vue,ts}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: '#FAF6EE',
          soft: '#F4EEE0',
        },
        ink: {
          DEFAULT: '#241C15',
          soft: '#4B443C',
          faint: '#8A8072',
        },
        line: {
          DEFAULT: '#E8E0D0',
          soft: '#F0EAD9',
        },
        brand: {
          50: '#EAF5F3',
          100: '#CFE7E3',
          200: '#9FCFC7',
          300: '#6FB7AB',
          400: '#3F9F8F',
          500: '#1D8474',
          600: '#146B63',
          700: '#0F5250',
          800: '#0B3E3D',
          900: '#082B2B',
        },
        gold: {
          50: '#FBF3DF',
          100: '#F3E3B4',
          200: '#E7CD80',
          300: '#D9B657',
          400: '#C89B3C',
          500: '#B0812C',
          600: '#8F6624',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'ui-serif', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}