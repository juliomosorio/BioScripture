<template>
  <a 
    :href="bibleUrl" 
    target="_blank" 
    title="Haga clic para leer en la Biblia y cambiar de versión"
    class="block bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 relative group hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm hover:shadow-md cursor-pointer text-left"
  >
    <svg class="w-8 h-8 text-indigo-200 absolute -top-3 -left-2 bg-[#F8FAFC] rounded-full px-1" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
    
    <blockquote class="text-sm italic text-slate-700 leading-relaxed font-medium">
      "{{ verse.text }}"
    </blockquote>
    
    <div class="mt-4 flex justify-between items-center">
      <div class="text-xs font-black text-indigo-600 uppercase tracking-wider">
        — {{ verse.reference }}
      </div>
      <svg class="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
    </div>
  </a>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  verse: {
    type: Object,
    required: true
  }
})

// Mapeo dinámico automatizado para estructurar el enlace de BibleGateway
const bibleUrl = computed(() => {
  // RVR1960 es la versión por defecto, pero BibleGateway le permite cambiarla con un clic
  const version = 'RVR1960'
  const encodedSearch = encodeURIComponent(props.props ? props.props.verse.reference : props.verse.reference)
  return `https://www.biblegateway.com/passage/?search=${encodedSearch}&version=${version}`
})
</script>