// Tema claro/oscuro. El script bloqueante en nuxt.config.ts ya aplica la
// clase "dark" antes de pintar (para evitar parpadeos); este composable solo
// sincroniza el estado reactivo y permite alternarlo desde la UI.
const isDark = ref(false)

export function useTheme() {
  const syncFromDom = () => {
    if (import.meta.client) {
      isDark.value = document.documentElement.classList.contains('dark')
    }
  }

  onMounted(syncFromDom)

  const toggleTheme = () => {
    if (!import.meta.client) return
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    try {
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    } catch {
      // localStorage no disponible (modo privado, etc.); no es crítico.
    }
  }

  return { isDark, toggleTheme }
}
