<template>
  <span>
    <template v-for="(part, i) in segments" :key="i">
      <NuxtLink
        v-if="part.id"
        :to="`/personaje/${part.id}`"
        class="text-brand-600 hover:text-brand-700 font-semibold underline decoration-brand-200 hover:decoration-brand-400 underline-offset-2 transition-colors"
      >{{ part.text }}</NuxtLink>
      <template v-else>{{ part.text }}</template>
    </template>
  </span>
</template>

<script setup>
const props = defineProps({
  text: { type: String, required: true },
  characters: { type: Array, default: () => [] }, // [{ id, name }]
  excludeId: { type: String, default: '' }
})

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const segments = computed(() => {
  const candidates = (props.characters || [])
    .filter(c => c.id !== props.excludeId && c.name)
    .sort((a, b) => b.name.length - a.name.length) // nombres largos primero (evita cortar "Juan el Bautista" en solo "Juan")

  if (!candidates.length || !props.text) {
    return [{ text: props.text, id: null }]
  }

  const byName = new Map(candidates.map(c => [c.name, c.id]))
  const pattern = new RegExp(
    `(?<![\\p{L}])(${candidates.map(c => escapeRegExp(c.name)).join('|')})(?![\\p{L}])`,
    'gu'
  )

  return props.text
    .split(pattern)
    .filter(part => part !== undefined && part !== '')
    .map(part => ({ text: part, id: byName.get(part) || null }))
})
</script>
