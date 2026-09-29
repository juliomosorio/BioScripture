// Progreso de lectura guardado en el navegador (localStorage), sin cuentas.
// Un personaje se marca como "leído" al abrir su página de detalle.
const STORAGE_KEY = 'bioscripture_read_characters'
const readIds = ref(new Set())
let loaded = false

function ensureLoaded() {
  if (loaded || !import.meta.client) return
  loaded = true
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) readIds.value = new Set(JSON.parse(raw))
  } catch {
    // localStorage no disponible (modo privado, etc.); no es crítico.
  }
}

function persist() {
  if (!import.meta.client) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(readIds.value)))
  } catch {
    // no es crítico si no se puede guardar
  }
}

export function useReadProgress() {
  ensureLoaded()

  const markRead = (id) => {
    if (!id || !import.meta.client || readIds.value.has(id)) return
    readIds.value.add(id)
    readIds.value = new Set(readIds.value) // fuerza reactividad en quienes leen .size
    persist()
  }

  const isRead = (id) => readIds.value.has(id)
  const readCount = computed(() => readIds.value.size)

  return { readIds, markRead, isRead, readCount }
}
