<template>
  <div class="min-h-screen flex flex-col bg-parchment">

    <nav class="fixed top-0 left-0 right-0 bg-parchment/85 backdrop-blur-md border-b border-line z-50 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <NuxtLink to="/" class="group">
            <BrandLogo :size="34" />
          </NuxtLink>

          <div class="hidden md:flex items-center gap-8 text-sm font-semibold text-ink-soft">
            <NuxtLink to="/" class="hover:text-brand-600 transition-colors">Inicio</NuxtLink>
            <NuxtLink to="/cronologia" class="hover:text-brand-600 transition-colors">Cronología</NuxtLink>
            <button @click="goRandom" :disabled="randomLoading" class="hover:text-brand-600 transition-colors disabled:opacity-50 flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
              {{ randomLoading ? 'Buscando...' : 'Sorpréndeme' }}
            </button>

            <form @submit.prevent="submitSearch" class="relative ml-4">
              <input v-model="navSearch" type="text" placeholder="Buscar personaje..." class="bg-surface border border-line rounded-full py-1.5 pl-4 pr-10 text-sm focus:ring-2 focus:ring-brand-400 focus:outline-none w-48 transition-all" />
              <button type="submit" class="absolute right-3 top-2 text-ink-faint hover:text-brand-600 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </button>
            </form>

            <button @click="toggleTheme" class="ml-1 p-2 rounded-full text-ink-faint hover:text-brand-600 hover:bg-parchment-soft transition-colors" :aria-label="isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'" :title="isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'">
              <svg v-if="!isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </button>
          </div>

          <button @click="toggleTheme" class="md:hidden p-2 text-ink-soft hover:text-brand-600 transition-colors" :aria-label="isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'">
            <svg v-if="!isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </button>

          <button @click="mobileOpen = !mobileOpen" class="md:hidden p-2 text-ink-soft hover:text-brand-600 transition-colors" aria-label="Abrir menú">
            <svg v-if="!mobileOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div v-if="mobileOpen" class="md:hidden pb-6 space-y-4">
          <form @submit.prevent="submitSearch" class="relative">
            <input v-model="navSearch" type="text" placeholder="Buscar personaje..." class="w-full bg-surface border border-line rounded-full py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-brand-400 focus:outline-none" />
            <button type="submit" class="absolute right-3 top-2.5 text-ink-faint">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
          </form>
          <NuxtLink to="/" @click="mobileOpen = false" class="block font-semibold text-ink-soft hover:text-brand-600">Inicio</NuxtLink>
          <NuxtLink to="/cronologia" @click="mobileOpen = false" class="block font-semibold text-ink-soft hover:text-brand-600">Cronología</NuxtLink>
          <button @click="goRandom" :disabled="randomLoading" class="block font-semibold text-ink-soft hover:text-brand-600 disabled:opacity-50">
            {{ randomLoading ? 'Buscando...' : 'Sorpréndeme' }}
          </button>
        </div>
      </div>
    </nav>

    <main class="flex-grow pt-16">
      <slot />
    </main>

    <footer class="bg-ink-fixed text-parchment py-14 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="flex justify-center mb-6">
          <BrandLogo :size="30" dark />
        </div>
        <h3 class="text-lg font-black text-white mb-6">Explora otras historias</h3>
        <div class="flex flex-wrap justify-center gap-4 mb-10">
          <NuxtLink to="/" class="px-6 py-2 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors">Volver al Inicio</NuxtLink>
          <button @click="goRandom" :disabled="randomLoading" class="px-6 py-2 bg-gold-400 text-ink font-semibold rounded-full hover:bg-gold-300 transition-colors disabled:opacity-50">
            {{ randomLoading ? 'Buscando...' : 'Personaje Aleatorio' }}
          </button>
        </div>
        <div class="border-t border-white/10 pt-8 text-xs text-white/50 max-w-2xl mx-auto leading-relaxed">
          <p class="mb-2 font-semibold text-white/70">Información de Traducción</p>
          <p>Los versículos citados en esta plataforma han sido cuidadosamente seleccionados de la traducción Reina-Valera 1960 (RVR1960), manteniendo el equilibrio entre la fidelidad al texto original hebreo/arameo/griego y la belleza literaria.</p>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()

const mobileOpen = ref(false)
const navSearch = ref('')
const randomLoading = ref(false)
const { isDark, toggleTheme } = useTheme()

const submitSearch = () => {
  if (!navSearch.value.trim()) return
  mobileOpen.value = false
  router.push({ path: '/', query: { search: navSearch.value } })
}

const goRandom = async () => {
  randomLoading.value = true
  mobileOpen.value = false
  try {
    const currentId = route.params.id
    const char = await $fetch(`${config.public.apiBase}/characters/random/`, {
      query: currentId ? { exclude: currentId } : {},
      retry: 6,
      retryDelay: 3000
    })
    router.push(`/personaje/${char.id}`)
  } catch (e) {
    // Sin personajes disponibles o API caída; no interrumpimos la navegación.
  } finally {
    randomLoading.value = false
  }
}
</script>
