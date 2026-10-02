<template>
  <div class="min-h-screen bg-parchment py-16 px-4 sm:px-6 lg:px-8 font-sans text-ink">
    <div class="max-w-2xl mx-auto">

      <header class="text-center mb-14">
        <h2 class="text-brand-600 font-extrabold tracking-widest text-sm uppercase mb-3">Acerca de</h2>
        <h1 class="font-serif text-5xl md:text-6xl font-black tracking-tight text-ink mb-6">BioScripture</h1>
        <p class="text-lg text-ink-soft leading-relaxed">
          Una enciclopedia web de personajes bíblicos: su historia, su genealogía, los lugares que recorrieron
          y los versículos que los definen, todo narrado de forma conectada en vez de como datos sueltos.
        </p>
      </header>

      <section class="bg-surface rounded-3xl border border-line shadow-sm p-8 md:p-10 mb-8">
        <h3 class="font-serif text-2xl font-black text-ink mb-4">¿Por qué existe?</h3>
        <p class="text-ink-soft leading-relaxed">
          Nació como un proyecto personal para profundizar en el desarrollo full-stack mientras se construía
          algo con contenido real detrás, no solo una demo. Cada personaje está escrito con una narrativa
          completa —no un resumen enciclopédico— y conectado con el resto a través de su familia, su época
          y las personas que menciona su historia.
        </p>
      </section>

      <section class="mb-8">
        <ClientOnly>
          <div class="grid grid-cols-3 gap-4">
            <div class="bg-surface rounded-2xl border border-line p-6 text-center">
              <div class="font-serif text-4xl font-black text-brand-600">{{ characterCount }}</div>
              <div class="text-xs font-bold text-ink-faint uppercase tracking-wider mt-1">Personajes</div>
            </div>
            <div class="bg-surface rounded-2xl border border-line p-6 text-center">
              <div class="font-serif text-4xl font-black text-brand-600">{{ eraCount }}</div>
              <div class="text-xs font-bold text-ink-faint uppercase tracking-wider mt-1">Épocas</div>
            </div>
            <div class="bg-surface rounded-2xl border border-line p-6 text-center">
              <div class="font-serif text-4xl font-black text-brand-600">{{ roleCount }}</div>
              <div class="text-xs font-bold text-ink-faint uppercase tracking-wider mt-1">Roles distintos</div>
            </div>
          </div>
          <template #fallback>
            <div class="grid grid-cols-3 gap-4">
              <div v-for="n in 3" :key="n" class="bg-surface rounded-2xl border border-line p-6 h-[92px] animate-pulse"></div>
            </div>
          </template>
        </ClientOnly>
      </section>

      <section class="bg-surface rounded-3xl border border-line shadow-sm p-8 md:p-10 mb-8">
        <h3 class="font-serif text-2xl font-black text-ink mb-5">Cómo está hecho</h3>
        <div class="flex flex-wrap gap-2">
          <span v-for="tech in stack" :key="tech" class="bg-parchment-soft border border-line text-ink-soft text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
            {{ tech }}
          </span>
        </div>
        <p class="text-ink-faint text-sm mt-5 leading-relaxed">
          Backend y frontend desplegados como servicios independientes (API, base de datos y sitio corren
          cada uno en su propia infraestructura), incluyendo generación de imágenes de vista previa para
          compartir cada personaje y un panel de administración propio para cargar contenido.
        </p>
      </section>

      <p class="text-center text-ink-faint text-sm">
        Hecho por Julio Munizaga.
      </p>

      <NuxtLink to="/" class="flex justify-center mt-8">
        <span class="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Volver al inicio
        </span>
      </NuxtLink>

    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Acerca de' })

const config = useRuntimeConfig()

const { data: summary } = await useFetch(`${config.public.apiBase}/characters/summary/`, {
  default: () => [],
  retry: 6,
  retryDelay: 3000
})

const { data: eras } = await useFetch(`${config.public.apiBase}/characters/eras/`, {
  default: () => [],
  retry: 6,
  retryDelay: 3000
})

const characterCount = computed(() => summary.value?.length || 0)
const eraCount = computed(() => eras.value?.length || 0)
const roleCount = computed(() => {
  const all = new Set()
  for (const c of summary.value || []) {
    for (const r of c.roles || []) all.add(r)
  }
  return all.size
})

const stack = [
  'Nuxt 4', 'Vue 3', 'Tailwind CSS',
  'FastAPI', 'PostgreSQL',
  'Render', 'Vercel', 'Neon',
]
</script>
