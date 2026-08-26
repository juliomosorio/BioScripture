<template>
  <div class="inline-flex items-center gap-2.5 select-none" :style="{ '--logo-size': size + 'px' }">
    <svg
      :style="{ width: size + 'px', height: size + 'px' }"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="flex-shrink-0"
      role="img"
      aria-label="BioScripture"
    >
      <defs>
        <linearGradient :id="gradId" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#146B63" />
          <stop offset="100%" stop-color="#0B3E3D" />
        </linearGradient>
        <linearGradient :id="flameId" x1="20" y1="4" x2="20" y2="17" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#F3E3B4" />
          <stop offset="100%" stop-color="#C89B3C" />
        </linearGradient>
      </defs>

      <rect width="40" height="40" rx="11" :fill="`url(#${gradId})`" />

      <path
        d="M9 14.5c2.3-1.3 5-1.9 7.4-1.5 1.2.2 2.3.7 3.1 1.6v14.6c-.8-.7-1.9-1.2-3.1-1.4-2.4-.4-5.1.2-7.4 1.5V14.5Z"
        fill="white" fill-opacity="0.92"
      />
      <path
        d="M31 14.5c-2.3-1.3-5-1.9-7.4-1.5-1.2.2-2.3.7-3.1 1.6v14.6c.8-.7 1.9-1.2 3.1-1.4 2.4-.4 5.1.2 7.4 1.5V14.5Z"
        fill="white" fill-opacity="0.78"
      />

      <path
        d="M20 4.6c1.7 1.9 2.6 3.6 2.6 5.2 0 1.55-1.16 2.6-2.6 2.6s-2.6-1.05-2.6-2.6c0-1.6.9-3.3 2.6-5.2Z"
        :fill="`url(#${flameId})`"
      />
    </svg>
    <span v-if="withWordmark" class="font-black tracking-tight leading-none" :class="dark ? 'text-white' : 'text-ink'" :style="{ fontSize: (size * 0.5) + 'px' }">
      Bio<span :class="dark ? 'text-gold-300' : 'text-brand-600'">Scripture</span>
    </span>
  </div>
</template>

<script setup>
import { useId } from 'vue'

defineProps({
  size: { type: Number, default: 32 },
  withWordmark: { type: Boolean, default: true },
  dark: { type: Boolean, default: false }
})

// Ids únicos por instancia (estables entre servidor y cliente) para que varios
// logos en la misma página no compartan gradiente
const uid = useId()
const gradId = `logo-bg-${uid}`
const flameId = `logo-flame-${uid}`
</script>
