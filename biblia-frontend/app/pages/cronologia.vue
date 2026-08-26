<template>
  <div class="flex flex-col bg-parchment font-sans text-ink overflow-hidden" style="height: calc(100vh - 4rem);">

    <header class="max-w-3xl mx-auto text-center px-4 pt-10 pb-6 shrink-0">
      <h2 class="text-brand-600 font-extrabold tracking-widest text-sm uppercase mb-3">Historia Sagrada</h2>
      <h1 class="font-serif text-4xl md:text-5xl font-black tracking-tight text-ink mb-3">Cronología Visual</h1>
      <p class="text-ink-faint text-sm">Todos los personajes ordenados por época. Desliza horizontalmente para recorrer el tiempo, y cada columna se desplaza sola verticalmente.</p>
      <NuxtLink to="/" class="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Volver a la lista
      </NuxtLink>
    </header>

    <div v-if="pending" class="text-center py-20 text-brand-400 animate-pulse font-bold">Cargando cronología...</div>

    <div v-else-if="error" class="max-w-md mx-auto text-center py-20 bg-white rounded-3xl border border-red-100 shadow-sm">
      <h3 class="text-xl font-bold text-red-500 mb-2">No se pudo conectar con la API</h3>
      <button @click="refresh()" class="mt-3 px-5 py-2 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-700 transition-colors">Reintentar</button>
    </div>

    <div v-else class="flex-1 min-h-0 relative">
      <div class="h-full overflow-x-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-stretch h-full min-w-max">
          <div
            v-for="group in grouped"
            :key="group.era"
            class="w-60 sm:w-64 shrink-0 border-r border-line last:border-r-0 pr-4 mr-4 h-full flex flex-col min-h-0"
          >
            <div class="shrink-0 bg-parchment pb-4">
              <div class="h-1.5 rounded-full bg-gradient-to-r from-brand-400 to-gold-300 mb-3"></div>
              <h3 class="font-serif font-black text-lg text-ink">{{ group.era }}</h3>
              <p class="text-xs text-ink-faint uppercase tracking-wider font-semibold">{{ group.characters.length }} personaje{{ group.characters.length === 1 ? '' : 's' }}</p>
            </div>

            <div class="flex-1 min-h-0 overflow-y-auto pr-1 space-y-3 pb-4">
              <NuxtLink
                v-for="char in group.characters"
                :key="char.id"
                :to="`/personaje/${char.id}`"
                class="flex items-center gap-3 bg-white rounded-xl border border-line p-3 hover:border-brand-300 hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div class="w-10 h-10 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center font-bold text-brand-700 flex-shrink-0 group-hover:bg-brand-100 transition-colors">
                  {{ initial(char.name) }}
                </div>
                <div class="min-w-0">
                  <div class="font-bold text-ink text-sm truncate group-hover:text-brand-600 transition-colors">{{ char.name }}</div>
                  <div v-if="char.roles?.length" class="text-xs text-ink-faint truncate">{{ char.roles[0] }}</div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <div class="pointer-events-none absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-parchment to-transparent"></div>
    </div>

  </div>
</template>

<script setup>
useHead({ title: 'Cronología' })

const config = useRuntimeConfig()

const { data: characters, pending, error, refresh } = await useFetch(`${config.public.apiBase}/characters/`, {
  query: { limit: 100 },
  default: () => [],
  retry: 6,
  retryDelay: 3000
})

const grouped = computed(() => {
  const map = new Map()
  for (const c of characters.value || []) {
    if (!map.has(c.era)) map.set(c.era, [])
    map.get(c.era).push(c)
  }
  return Array.from(map.entries()).map(([era, list]) => ({ era, characters: list }))
})

const initial = (name) => (name || '?').trim().charAt(0).toUpperCase()
</script>
