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
        <NuxtLink to="/" class="inline-block px-6 py-2 bg-ink-fixed text-white font-semibold rounded-full hover:bg-brand-700 transition-colors">Volver al inicio</NuxtLink>
      </div>
    </div>

    <div v-else-if="character">

      <header class="relative h-80 md:h-96 w-full bg-ink-fixed overflow-hidden flex items-center justify-center">
        <img
          v-if="character.cover_url"
          :src="character.cover_url"
          :alt="character.name"
          class="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-ink-fixed via-ink-fixed/40 to-ink-fixed/10"></div>

        <a
          :href="whatsappUrl"
          target="_blank"
          rel="noopener"
          aria-label="Compartir por WhatsApp"
          title="Compartir por WhatsApp"
          class="absolute top-5 right-5 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white hover:bg-[#25D366] hover:border-[#25D366] transition-colors"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.004 2C6.478 2 2 6.477 2 12.002c0 2.045.596 3.995 1.7 5.65L2 22l4.44-1.65a9.96 9.96 0 005.564 1.65h.004c5.525 0 10.002-4.478 10.002-10.002C22 6.477 17.53 2 12.004 2zm0 18.156a8.16 8.16 0 01-4.156-1.14l-.298-.177-3.06 1.137 1.155-3.008-.194-.31a8.14 8.14 0 01-1.25-4.356c0-4.502 3.663-8.165 8.166-8.165 4.502 0 8.165 3.663 8.165 8.165 0 4.503-3.663 8.166-8.165 8.166z"/></svg>
        </a>

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

              <div class="bg-surface p-6 rounded-2xl shadow-sm border border-line">
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

              <div v-if="character.related_characters && character.related_characters.length" class="bg-surface p-6 rounded-2xl shadow-sm border border-line">
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
  retry: 6,
  retryDelay: 3000
})

const { data: summary } = await useFetch(`${config.public.apiBase}/characters/summary/`, {
  default: () => [],
  retry: 6,
  retryDelay: 3000
})

const { markRead } = useReadProgress()
watch(character, (c) => {
  if (c) markRead(characterId)
}, { immediate: true })

const relatedIdByName = computed(() => {
  const map = {}
  for (const s of summary.value || []) map[s.name] = s.id
  return map
})

useHead({ title: computed(() => character.value?.name || 'Personaje') })

// --- Vista previa (Open Graph) y compartir por WhatsApp ---
const requestUrl = useRequestURL()
const pageUrl = computed(() => `${requestUrl.origin}${route.fullPath}`)

const hook = computed(() => {
  const content = character.value?.story_sections?.[0]?.content || ''
  if (content.length <= 150) return content
  return content.slice(0, 150).trim() + '…'
})

const ogImageUrl = computed(() => `${requestUrl.origin}/og/${characterId}.png`)

useSeoMeta({
  ogTitle: () => character.value?.name,
  description: () => hook.value,
  ogDescription: () => hook.value,
  ogImage: () => ogImageUrl.value,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogUrl: () => pageUrl.value,
  twitterCard: 'summary_large_image',
  twitterImage: () => ogImageUrl.value,
})

const whatsappUrl = computed(() => {
  if (!character.value) return 'https://wa.me/'
  const roleLine = character.value.roles?.[0] ? ` (${character.value.roles[0]})` : ''
  const text = `📜 ${character.value.name}${roleLine}: ${hook.value}\n\nDescúbrelo en BioScripture 👉 ${pageUrl.value}`
  return `https://wa.me/?text=${encodeURIComponent(text)}`
})
</script>
