/** @type {import('tailwindcss').Config} */

// Convierte una variable CSS de canales RGB ("R G B") en un color que
// Tailwind puede usar con modificadores de opacidad (ej. bg-brand-600/50).
const withOpacity = (variable) => `rgb(var(${variable}) / <alpha-value>)`

export default {
  content: [
    "./app/**/*.{js,vue,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: withOpacity('--color-parchment'),
          soft: withOpacity('--color-parchment-soft'),
        },
        surface: withOpacity('--color-surface'),
        ink: {
          DEFAULT: withOpacity('--color-ink'),
          soft: withOpacity('--color-ink-soft'),
          faint: withOpacity('--color-ink-faint'),
        },
        line: {
          DEFAULT: withOpacity('--color-line'),
          soft: withOpacity('--color-line-soft'),
        },
        brand: {
          50: withOpacity('--color-brand-50'),
          100: withOpacity('--color-brand-100'),
          200: withOpacity('--color-brand-200'),
          300: withOpacity('--color-brand-300'),
          400: withOpacity('--color-brand-400'),
          500: withOpacity('--color-brand-500'),
          600: withOpacity('--color-brand-600'),
          700: withOpacity('--color-brand-700'),
          800: withOpacity('--color-brand-800'),
          900: withOpacity('--color-brand-900'),
        },
        gold: {
          50: withOpacity('--color-gold-50'),
          100: withOpacity('--color-gold-100'),
          200: withOpacity('--color-gold-200'),
          300: withOpacity('--color-gold-300'),
          400: withOpacity('--color-gold-400'),
          500: withOpacity('--color-gold-500'),
          600: withOpacity('--color-gold-600'),
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
