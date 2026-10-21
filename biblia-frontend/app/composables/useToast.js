// Avisos temporales (ej. "Logro desbloqueado").
const toasts = ref([])
let nextId = 0

export function useToast() {
  const push = ({ title, body }) => {
    const item = { id: ++nextId, title, body }
    toasts.value = [...toasts.value, item]
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== item.id)
    }, 5000)
  }
  return { toasts, push }
}
