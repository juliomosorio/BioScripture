// Se ejecuta una vez desde el layout: cada vez que cambia la lectura o el
// progreso de juego, revisa qué logros se cumplieron y avisa con un toast.
export function useBadgeEngine() {
  const config = useRuntimeConfig()
  const { data: summary } = useFetch(`${config.public.apiBase}/characters/summary/`, {
    key: 'summary-badges', server: false, lazy: true, default: () => [], retry: 6, retryDelay: 3000,
  })
  const { game, revision, dailyStreak, unlockBadges } = useGameProgress()
  const { readIds } = useReadProgress()
  const { push } = useToast()

  const evaluate = () => {
    if (!import.meta.client || !summary.value.length) return
    const ctx = {
      readIds: readIds.value, readCount: readIds.value.size, summary: summary.value,
      stats: game.value, dailyStreak: dailyStreak.value,
    }
    const newly = buildBadgeDefs(summary.value).filter((d) => !game.value.badges[d.id] && d.check(ctx))
    if (!newly.length) return
    unlockBadges(newly.map((d) => d.id))
    if (newly.length <= 3) newly.forEach((d) => push({ title: 'Logro desbloqueado', body: d.title }))
    else push({ title: 'Logros desbloqueados', body: `${newly.length} logros nuevos` })
  }

  watch([summary, readIds, revision], evaluate, { immediate: true })
}
