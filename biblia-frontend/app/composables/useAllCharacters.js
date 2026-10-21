// Todos los personajes completos (con versículos, lugares y libros), usados por
// el quiz y el reto del día. La clave compartida evita pedirlos dos veces.
export function useAllCharacters(opts = {}) {
  const config = useRuntimeConfig()
  return useFetch(`${config.public.apiBase}/characters/`, {
    key: 'all-characters',
    query: { limit: 200 },
    default: () => [],
    retry: 6,
    retryDelay: 3000,
    ...opts,
  })
}
