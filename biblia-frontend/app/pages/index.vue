<template>
  <div class="min-h-screen bg-[#F8FAFC] py-16 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
    
    <header class="max-w-3xl mx-auto text-center mb-12">
      <h2 class="text-indigo-600 font-extrabold tracking-widest text-sm uppercase mb-3">Historia Sagrada</h2>
      <h1 class="text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-6">Línea de Tiempo</h1>
      
      <div class="max-w-md mx-auto relative mb-8">
        <input v-model="searchQuery" @input="fetchFilteredData" type="text" placeholder="Buscar por nombre (ej: Adán)..." class="w-full bg-white border border-slate-200 rounded-full py-3 pl-5 pr-12 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" />
        <svg class="w-5 h-5 text-indigo-400 absolute right-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>

      <div class="flex flex-wrap justify-center gap-2">
        <button @click="setEra('')" :class="selectedEra === '' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'" class="px-4 py-1.5 rounded-full text-sm font-bold transition-colors">
          Todos
        </button>
        <button v-for="era in eras" :key="era" @click="setEra(era)" :class="selectedEra === era ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'" class="px-4 py-1.5 rounded-full text-sm font-bold transition-colors">
          {{ era }}
        </button>
      </div>
    </header>

    <div class="max-w-4xl mx-auto relative">
      <div class="absolute left-[38px] md:left-[62px] top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 via-purple-300 to-[#F8FAFC] rounded-full opacity-50"></div>

      <div v-if="pending" class="text-center py-20 text-indigo-400 animate-pulse font-bold">Cargando registros...</div>
      
      <div v-else-if="characters && characters.length === 0" class="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm relative z-10">
        <h3 class="text-xl font-bold text-slate-700 mb-2">Ningún personaje encontrado</h3>
        <p class="text-slate-500">Prueba con otra búsqueda u otra época.</p>
      </div>

      <div v-else class="space-y-16">
        <CharacterCard 
          v-for="char in characters || []" 
          :key="char.id" 
          :character="char" 
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const selectedEra = ref('')
const eras = ['Inicios', 'Mundo Antiguo', 'Patriarcas', 'Éxodo', 'Nuevo Testamento']

// Parámetros reactivos para la petición
const queryParams = computed(() => {
  const params = {}
  if (searchQuery.value) params.search = searchQuery.value
  if (selectedEra.value) params.era = selectedEra.value
  return params
})

const { data: characters, pending, refresh } = await useFetch('http://localhost:8000/characters/', {
  query: queryParams,
  watch: [queryParams] // Refresca automáticamente si el usuario escribe o hace clic en un filtro
})

// Función para cambiar el filtro
const setEra = (era) => {
  selectedEra.value = era
}

// Pequeño retraso para no saturar la base de datos con cada letra que se escribe
let timeout
const fetchFilteredData = () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    refresh()
  }, 300)
}
</script>