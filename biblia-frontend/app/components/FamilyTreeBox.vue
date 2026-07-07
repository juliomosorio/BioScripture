<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-8">
    <h4 class="font-bold text-slate-900 mb-6 text-xs uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3">
      <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
      </svg>
      Registro Genealógico
    </h4>

    <div class="font-sans" v-if="hasTreeData">
      
      <div v-if="character.parents?.length" class="mb-5">
        <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Ascendencia</div>
        <div class="flex flex-wrap gap-2">
          <NuxtLink 
            v-for="parent in character.parents" 
            :key="parent"
            :to="`/personaje/${slugify(parent)}`"
            class="bg-white border border-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg text-xs hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 shadow-sm transition-colors"
          >
            {{ parent }}
          </NuxtLink>
        </div>
      </div>

      <div class="relative pl-5 ml-3 border-l-2 border-slate-200 space-y-6 pb-2">
        
        <div v-if="character.siblings?.length" class="relative">
          <div class="absolute -left-[22px] top-3.5 w-5 border-t-2 border-slate-200"></div>
          
          <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Fraternidad</div>
          <div class="flex flex-wrap gap-2">
            <NuxtLink 
              v-for="sibling in character.siblings" 
              :key="sibling"
              :to="`/personaje/${slugify(sibling)}`"
              class="bg-slate-50 border border-slate-200 text-slate-600 font-medium px-2.5 py-1.5 rounded-lg text-xs hover:border-slate-300 hover:bg-slate-100 transition-colors"
            >
              {{ sibling }}
            </NuxtLink>
          </div>
        </div>

        <div class="relative">
          <div class="absolute -left-[22px] top-4 w-5 border-t-2 border-slate-200"></div>
          
          <div class="flex flex-wrap items-center gap-2">
            <div class="bg-slate-900 text-white font-bold uppercase tracking-wider shadow-md border border-slate-800 px-4 py-2 rounded-lg text-xs">
              {{ character.name }}
            </div>
            
            <template v-if="character.spouses?.length">
              <span class="text-slate-300 font-serif italic text-xl leading-none mt-0.5">⚭</span>
              <NuxtLink 
                v-for="spouse in character.spouses" 
                :key="spouse"
                :to="`/personaje/${slugify(spouse)}`"
                class="bg-white border border-slate-300 border-dashed text-slate-600 font-medium px-3 py-1.5 rounded-lg text-xs hover:border-indigo-300 hover:border-solid hover:text-indigo-600 transition-colors"
              >
                {{ spouse }}
              </NuxtLink>
            </template>
          </div>

          <div v-if="character.children?.length" class="relative pl-6 ml-4 mt-5 border-l-2 border-slate-200 space-y-2">
            <div class="absolute -left-[2px] top-4 w-5 border-t-2 border-slate-200"></div>
            
            <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 pt-1">Descendencia</div>
            <div class="flex flex-wrap gap-2 pb-2">
              <NuxtLink 
                v-for="child in character.children" 
                :key="child"
                :to="`/personaje/${slugify(child)}`"
                class="bg-white border border-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg text-xs hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 shadow-sm transition-colors"
              >
                {{ child }}
              </NuxtLink>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div v-else class="text-xs text-slate-400 italic text-center w-full py-4">
      Aún no hay registros familiares vinculados.
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  character: {
    type: Object,
    required: true
  }
})

// Validación dinámica para ver si se debe pintar el árbol
const hasTreeData = computed(() => {
  const c = props.character
  return (c.parents?.length > 0) || (c.siblings?.length > 0) || (c.spouses?.length > 0) || (c.children?.length > 0)
})

// Formateador de URLs
const slugify = (text) => {
  if (!text) return ''
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
}
</script>