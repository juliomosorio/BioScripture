<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full" v-html="ICONS[iconKey] || ICONS.book"></svg>
</template>

<script setup>
// Elige un ícono ilustrado según los roles del personaje, en vez de mostrar
// un retrato real (que para la mayoría de los personajes bíblicos no existe
// o es solo interpretación artística sin consenso). Las reglas están
// ordenadas de más específicas a más genéricas: la primera que coincide con
// alguno de los roles del personaje gana. Un personaje nuevo consigue un
// ícono razonable automáticamente, sin tener que asignarlo a mano.

const props = defineProps({
  roles: { type: Array, default: () => [] }
})

const RULES = [
  { icon: 'star', keywords: ['mesías', 'hijo de dios'] },
  { icon: 'ark', keywords: ['constructor del arca'] },
  { icon: 'harp', keywords: ['músico'] },
  { icon: 'tablets', keywords: ['legislador'] },
  { icon: 'wheat', keywords: ['moabita'] },
  { icon: 'fish', keywords: ['pescador'] },
  { icon: 'eye', keywords: ['sierva egipcia', 'madre de ismael'] },
  { icon: 'coin', keywords: ['recaudador', 'publicanos', 'traidor'] },
  { icon: 'cup', keywords: ['copero'] },
  { icon: 'drop', keywords: ['bautista', 'precursor del mesías'] },
  { icon: 'lily', keywords: ['madre de jesús'] },
  { icon: 'staff-snake', keywords: ['médico'] },
  { icon: 'dove', keywords: ['testigo de la resurrección', 'discípula'] },
  { icon: 'flame', keywords: ['mártir'] },
  { icon: 'crown', keywords: ['rey', 'reina', 'príncipe'] },
  { icon: 'scale', keywords: ['sabio', 'consejero', 'gobernador', 'fariseo', 'maestro de israel', 'sanedrín'] },
  { icon: 'scroll', keywords: ['profeta', 'profetisa', 'evangelista', 'escritor', 'teólogo', 'historiador'] },
  { icon: 'sword', keywords: ['guerrero', 'comandante militar', 'hombre fuerte'] },
  { icon: 'tent', keywords: ['patriarca', 'matriarca', 'sobrino de abraham'] },
  { icon: 'scale', keywords: ['juez', 'jueza'] },
  { icon: 'cross', keywords: ['apóstol', 'discípulo', 'diácono'] },
]

function resolveIcon(roles) {
  const text = (roles || []).join(' | ').toLowerCase()
  for (const rule of RULES) {
    if (rule.keywords.some((k) => text.includes(k))) return rule.icon
  }
  return 'book'
}

const iconKey = computed(() => resolveIcon(props.roles))

// Trazos simples (estilo consistente, un solo color vía currentColor) para
// cada categoría. No pretenden ser retratos ni afirmar cómo se veía nadie.
const ICONS = {
  book: '<path d="M4 5.5c2.2-1.2 4.8-1.2 8 0v13c-3.2-1.2-5.8-1.2-8 0v-13Z"/><path d="M20 5.5c-2.2-1.2-4.8-1.2-8 0v13c3.2-1.2 5.8-1.2 8 0v-13Z"/>',
  scroll: '<path d="M6 4h9a3 3 0 013 3v13H9a3 3 0 01-3-3V4Z"/><path d="M6 4a2 2 0 00-2 2v11a2 2 0 002 2"/><path d="M9 9h6M9 13h6"/>',
  crown: '<path d="M4 18h16"/><path d="M4 18l-1-9 5 4 4-7 4 7 5-4-1 9"/>',
  sword: '<path d="M14.5 3.5L20.5 9.5"/><path d="M6 18l8.5-8.5 2 2L8 20l-3.5 1.5L6 18Z"/><path d="M4 20l2-2"/><path d="M12.5 5.5l2 2"/>',
  crossIcon: '',
  cross: '<path d="M12 3v18"/><path d="M6 8h12"/>',
  scale: '<path d="M12 3v3"/><path d="M4 8h16"/><path d="M4 8l3 6a3 3 0 006 0l-3-6"/><path d="M14 8l3 6a3 3 0 006 0l-3-6"/><path d="M8 21h8"/><path d="M12 6v15"/>',
  tent: '<path d="M12 4l9 16H3l9-16Z"/><path d="M12 4v16"/><path d="M7.5 20L12 11l4.5 9"/>',
  fish: '<path d="M3 12c3-4 8-6 13-4 2 .8 4 2.4 5 4-1 1.6-3 3.2-5 4-5 2-10 0-13-4Z"/><path d="M16 10.5l1.5-2M16 13.5l1.5 2"/><circle cx="7.5" cy="12" r=".6" fill="currentColor" stroke="none"/>',
  dove: '<path d="M3 12c2-3 5-4 7-2 1-3 4-5 8-4-2 1-3 2-3 4 3 0 5 1 6 3-3 0-5 0-7-1-1 3-4 5-8 5 2-2 2-4 1-5-2 1-3 1-4 0Z"/>',
  flame: '<path d="M12 3c2 3 1 4-.5 6S9 13 12 21c5-1 8-5 6-10-1 2-2 2-3 1 1-3-1-6-3-9Z"/>',
  drop: '<path d="M12 3c3.5 4.5 6 8 6 11a6 6 0 11-12 0c0-3 2.5-6.5 6-11Z"/>',
  cup: '<path d="M6 4h12l-1 9a5 5 0 01-10 0L6 4Z"/><path d="M9 20h6"/><path d="M12 17v3"/><path d="M18 6h2a2 2 0 01-2 4"/>',
  coin: '<circle cx="12" cy="12" r="8"/><path d="M9.5 9.5a2.5 2 0 015 0c0 1.2-1 1.8-2.5 2.5-1.5.7-2.5 1.3-2.5 2.5a2.5 2 0 005 0"/>',
  wheat: '<path d="M12 21V6"/><path d="M12 6l-2.5 2M12 6l2.5 2"/><path d="M12 10l-2.5 2M12 10l2.5 2"/><path d="M12 14l-2.5 2M12 14l2.5 2"/>',
  harp: '<path d="M6 20V6a6 6 0 0112 0"/><path d="M6 20h2M16 20h2"/><path d="M8 8h10M8 12h10M8 16h10"/>',
  tablets: '<path d="M5 5h6l1 3v13H5V5Z"/><path d="M12 5h6l1 3v13h-7V5Z"/><path d="M7.5 10h2M7.5 13h2M14.5 10h2M14.5 13h2"/>',
  star: '<path d="M12 3l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L12 16.9l-5.6 3.1 1.4-6.2-4.8-4.3 6.4-.6L12 3Z"/>',
  ark: '<path d="M4 13h16l-2 6H6l-2-6Z"/><path d="M6 13V8a1 1 0 011-1h10a1 1 0 011 1v5"/><path d="M9 7V5h6v2"/>',
  eye: '<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="3"/>',
  lily: '<path d="M12 21V9"/><path d="M12 9c-3-1-4-4-4-7 3 0 5 1.5 6 4M12 9c3-1 4-4 4-7-3 0-5 1.5-6 4"/><path d="M9 21h6"/>',
  'staff-snake': '<path d="M8 21c4-6 4-12 0-18"/><path d="M8 3c2 1.5 2 3 0 4.5S6 11 8 12.5s2 3 0 4.5"/><path d="M16 5v16"/>',
}
</script>
