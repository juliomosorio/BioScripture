<template>
  <div class="font-sans text-ink antialiased">

    <div v-if="pending" class="pt-24 pb-20 max-w-4xl mx-auto px-4 animate-pulse">
      <div class="h-10 w-2/3 bg-line-soft rounded-xl mb-4 mx-auto"></div>
      <div class="h-4 w-1/3 bg-parchment-soft rounded-full mb-12 mx-auto"></div>
      <div class="space-y-3">
        <div class="h-4 w-full bg-parchment-soft rounded-full"></div>
        <div class="h-4 w-full bg-parchment-soft rounded-full"></div>
        <div class="h-4 w-2/3 bg-parchment-soft rounded-full"></div>
      </div>
    </div>

    <div v-else-if="error" class="pt-20 pb-20 text-center px-4">
      <h2 class="text-2xl font-bold text-red-500 mb-3">No se pudo encontrar la historia de este personaje.</h2>
      <p class="text-ink-faint mb-6">{{ error?.statusCode === 404 ? 'Puede que el enlace esté roto o el personaje aún no exista en el registro.' : 'No se pudo conectar con la API. Verifica que el backend esté corriendo.' }}</p>
      <div class="flex justify-center gap-3">
        <button v-if="error?.statusCode !== 404" @click="refresh()" class="px-6 py-2 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-700 transition-colors">Reintentar</button>
        <NuxtLink to="/" class="inline-block px-6 py-2 bg-ink text-white font-semibold rounded-full hover:bg-brand-700 transition-colors">Volver al inicio</NuxtLink>
      </div>
    </div>

    <div v-else-if="character">

      <header class="relative h-80 md:h-96 w-full bg-ink overflow-hidden flex items-center justify-center">
        <img
          v-if="character.cover_url"
          :src="character.cover_url"
          :alt="character.name"
          class="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10"></div>

        <div class="relative z-10 text-center px-4 max-w-4xl mx-auto mt-8">
          <span class="text-gold-300 font-bold tracking-widest uppercase text-sm mb-4 block">
            {{ character.era }}
          </span>
          <h1 class="font-serif text-6xl md:text-8xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
            {{ character.name }}
          </h1>
          <p v-if="character.roles && character.roles.length" class="text-xl md:text-2xl text-white/70 font-medium max-w-2xl mx-auto">
            {{ character.roles.join(' · ') }}
          </p>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 relative">

          <aside class="lg:col-span-3">
            <div class="sticky top-24 space-y-8">

              <div class="bg-white p-6 rounded-2xl shadow-sm border border-line">
                <h3 class="font-bold text-ink mb-4 border-b border-line pb-2">Datos Clave</h3>
                <dl class="space-y-4 text-sm">
                  <div>
                    <dt class="text-ink-faint font-semibold uppercase tracking-wider text-[10px] mb-1">Época</dt>
                    <dd class="text-ink font-medium">{{ character.era }}</dd>
                  </div>

                  <div>
                    <dt class="text-ink-faint font-semibold uppercase tracking-wider text-[10px] mb-1">Libros</dt>
                    <dd class="flex flex-wrap gap-1.5">
                      <a
                        v-for="book in character.books_referenced"
                        :key="book"
                        :href="`https://www.biblegateway.com/passage/?search=${encodeURIComponent(book)}+1&version=RVR1960`"
                        target="_blank"
                        class="text-xs bg-parchment-soft hover:bg-brand-50 border border-line hover:border-brand-200 text-ink-soft hover:text-brand-700 px-2.5 py-1 rounded-md font-bold transition-all flex items-center gap-1"
                      >
                        {{ book }}
                        <svg class="w-2.5 h-2.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>

              <div v-if="character.related_characters && character.related_characters.length" class="bg-white p-6 rounded-2xl shadow-sm border border-line">
                <h3 class="font-bold text-ink mb-4 border-b border-line pb-2">Otras Conexiones</h3>
                <ul class="space-y-2">
                  <li v-for="rel in character.related_characters" :key="rel" class="flex items-center gap-2 text-sm font-medium text-ink-soft">
                    <div class="w-1.5 h-1.5 rounded-full bg-gold-400"></div>
                    <NuxtLink v-if="relatedIdByName[rel]" :to="`/personaje/${relatedIdByName[rel]}`" class="hover:text-brand-600 transition-colors">{{ rel }}</NuxtLink>
                    <span v-else>{{ rel }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </aside>

          <article class="lg:col-span-6">
            <div class="prose prose-lg lg:prose-xl max-w-none prose-headings:font-serif prose-headings:text-ink prose-p:text-ink-soft prose-a:text-brand-600">
              <div v-for="(section, index) in character.story_sections" :key="index" class="mb-12">
                <h2 class="font-extrabold text-ink tracking-tight">{{ section.heading }}</h2>
                <p class="leading-relaxed text-ink-soft whitespace-pre-line">
                  <LinkedText :text="section.content" :characters="summary" :exclude-id="characterId" />
                </p>
              </div>
            </div>

            <ClientOnly>
              <TriviaBox :character="character" :pool="summary" />
            </ClientOnly>
          </article>

          <aside class="lg:col-span-3">
            <div class="sticky top-24 space-y-6">
              <h3 class="font-bold text-ink-faint uppercase tracking-widest text-xs mb-4">Análisis Bíblico</h3>

              <VerseCard
                v-for="(verse, index) in character.key_verses"
                :key="index"
                :verse="verse"
              />

              <HistoricalContextBox />

              <HistoricalMapBox
                v-if="character.locations && character.locations.length > 0"
                :locations="character.locations"
              />

              <FamilyTreeBox
                :character="character"
              />

            </div>
          </aside>

        </div>
      </main>

    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const characterId = route.params.id
const config = useRuntimeConfig()

const { data: character, pending, error, refresh } = await useFetch(`${config.public.apiBase}/characters/${characterId}`, {
  retry: 2,
  retryDelay: 400
})

const { data: summary } = await useFetch(`${config.public.apiBase}/characters/summary/`, {
  default: () => [],
  retry: 2,
  retryDelay: 400
})

const relatedIdByName = computed(() => {
  const map = {}
  for (const s of summary.value || []) map[s.name] = s.id
  return map
})

useHead({ title: computed(() => character.value?.name || 'Personaje') })
</script>
