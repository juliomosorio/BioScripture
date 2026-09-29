<template>
  <div class="min-h-screen bg-parchment py-16 px-4 sm:px-6 lg:px-8 font-sans text-ink">

    <header class="max-w-3xl mx-auto text-center mb-12">
      <h2 class="text-brand-600 font-extrabold tracking-widest text-sm uppercase mb-3">Historia Sagrada</h2>
      <h1 class="font-serif text-5xl md:text-6xl font-black tracking-tight text-ink mb-6">Línea de Tiempo</h1>

      <div class="max-w-md mx-auto relative mb-8">
        <input v-model="searchQuery" @input="fetchFilteredData" type="text" placeholder="Buscar por nombre, versículo (Juan 3:16), historia o rol..." class="w-full bg-surface border border-line rounded-full py-3 pl-5 pr-12 shadow-sm focus:ring-2 focus:ring-brand-400 focus:outline-none transition-all" />
        <svg class="w-5 h-5 text-brand-400 absolute right-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>

      <div class="flex flex-wrap justify-center gap-2 mb-4">
        <button @click="setEra('')" :class="selectedEra === '' ? 'bg-brand-600 text-white' : 'bg-surface text-ink-soft hover:bg-parchment-soft border border-line'" class="px-4 py-1.5 rounded-full text-sm font-bold transition-colors">
          Todas las épocas
        </button>
        <button v-for="era in eras" :key="era" @click="setEra(era)" :class="selectedEra === era ? 'bg-brand-600 text-white' : 'bg-surface text-ink-soft hover:bg-parchment-soft border border-line'" class="px-4 py-1.5 rounded-full text-sm font-bold transition-colors">
          {{ era }}
        </button>
      </div>

      <div v-if="roles && roles.length" class="flex flex-wrap justify-center gap-2">
        <button @click="setRole('')" :class="selectedRole === '' ? 'bg-gold-400 text-ink' : 'bg-surface text-ink-faint hover:bg-gold-50 border border-line'" class="px-3 py-1 rounded-full text-xs font-bold transition-colors">
          Todos los roles
        </button>
        <button v-for="role in roles" :key="role" @click="setRole(role)" :class="selectedRole === role ? 'bg-gold-400 text-ink' : 'bg-surface text-ink-faint hover:bg-gold-50 border border-line'" class="px-3 py-1 rounded-full text-xs font-bold transition-colors">
          {{ role }}
        </button>
      </div>

      <NuxtLink to="/cronologia" class="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        Ver cronología visual
      </NuxtLink>

      <ClientOnly>
        <div v-if="totalCount" class="max-w-xs mx-auto mt-6">
          <p class="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-1.5">{{ readCount }} de {{ totalCount }} personajes leídos</p>
          <div class="h-1.5 rounded-full bg-line-soft overflow-hidden">
            <div class="h-full bg-brand-500 rounded-full transition-all duration-500" :style="{ width: `${Math.min(100, (readCount / totalCount) * 100)}%` }"></div>
          </div>
        </div>
      </ClientOnly>
    </header>

    <div class="max-w-4xl mx-auto relative">
      <div class="absolute left-[38px] md:left-[62px] top-0 bottom-0 w-1 bg-gradient-to-b from-brand-300 via-gold-200 to-parchment rounded-full opacity-60"></div>

      <div v-if="pending" class="space-y-16">
        <div v-for="n in 3" :key="n" class="flex flex-col md:flex-row items-start gap-6 md:gap-12 animate-pulse">
          <div class="w-20 h-20 md:w-32 md:h-32 rounded-full bg-line-soft flex-shrink-0"></div>
          <div class="flex-1 w-full pt-2 md:pt-6 bg-surface rounded-3xl p-6 md:p-8 border border-line space-y-4">
            <div class="h-6 w-1/3 bg-line-soft rounded-full"></div>
            <div class="h-4 w-full bg-line-soft rounded-full"></div>
            <div class="h-4 w-2/3 bg-line-soft rounded-full"></div>
          </div>
        </div>
      </div>

      <div v-else-if="error" class="text-center py-20 bg-surface rounded-3xl border border-red-100 shadow-sm relative z-10">
        <h3 class="text-xl font-bold text-red-500 mb-2">No se pudo conectar con la API</h3>
        <p class="text-ink-faint mb-4">Verifica que el backend esté corriendo en <code class="bg-parchment-soft px-1.5 py-0.5 rounded">{{ apiBase }}</code>.</p>
        <button @click="refresh()" class="px-5 py-2 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-700 transition-colors">Reintentar</button>
      </div>

      <div v-else-if="characters && characters.length === 0" class="text-center py-20 bg-surface rounded-3xl border border-line shadow-sm relative z-10">
        <h3 class="text-xl font-bold text-ink-soft mb-2">Ningún personaje encontrado</h3>
        <p class="text-ink-faint">Prueba con otra búsqueda u otra época.</p>
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

useHead({ title: 'Inicio' })

const config = useRuntimeConfig()
const apiBase = config.public.apiBase
const route = useRoute()
const router = useRouter()

const searchQuery = ref(typeof route.query.search === 'string' ? route.query.search : '')
const selectedEra = ref('')
const selectedRole = ref('')

const { data: eras } = await useFetch(`${apiBase}/characters/eras/`, {
  default: () => [],
  retry: 6,
  retryDelay: 3000
})

const { data: roles } = await useFetch(`${apiBase}/characters/roles/`, {
  default: () => [],
  retry: 6,
  retryDelay: 3000
})

const { data: allSummary } = await useFetch(`${apiBase}/characters/summary/`, {
  default: () => [],
  retry: 6,
  retryDelay: 3000
})
const totalCount = computed(() => allSummary.value?.length || 0)
const { readCount } = useReadProgress()

// Parámetros reactivos para la petición
const queryParams = computed(() => {
  const params = { limit: 100 }
  if (searchQuery.value) params.search = searchQuery.value
  if (selectedEra.value) params.era = selectedEra.value
  if (selectedRole.value) params.role = selectedRole.value
  return params
})

const { data: characters, pending, error, refresh } = await useFetch(`${apiBase}/characters/`, {
  query: queryParams,
  watch: [queryParams], // Refresca automáticamente si el usuario escribe o hace clic en un filtro
  retry: 6,
  retryDelay: 3000
})

// Si la búsqueda parece una referencia bíblica (ej. "Juan 3:16") y arroja un
// único resultado, saltamos directo a ese personaje en vez de mostrar la lista.
watch([characters, pending], ([chars, isPending]) => {
  if (isPending || !chars || chars.length !== 1) return
  if (/\d+\s*:\s*\d+/.test(searchQuery.value)) {
    router.push(`/personaje/${chars[0].id}`)
  }
})

// Función para cambiar el filtro
const setEra = (era) => {
  selectedEra.value = era
}

const setRole = (role) => {
  selectedRole.value = role
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
