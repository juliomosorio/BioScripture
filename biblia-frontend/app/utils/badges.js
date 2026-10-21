// Definiciones de logros. `ctx` trae: readIds (Set), readCount, total,
// summary (personajes), stats (progreso de juego) y dailyStreak.
// `progress` es opcional y alimenta la barra de avance de los logros bloqueados.

const counter = (id, title, desc, tier, max, getter) => ({
  id, title, desc, tier,
  check: (c) => getter(c) >= max,
  progress: (c) => ({ cur: Math.min(getter(c), max), max }),
})

export function buildBadgeDefs(summary = []) {
  const total = summary.length

  const defs = [
    counter('read-1', 'Primer paso', 'Lee tu primer personaje.', 'bronze', 1, (c) => c.readCount),
    counter('read-10', 'Lector curioso', 'Lee 10 personajes.', 'bronze', 10, (c) => c.readCount),
    counter('read-25', 'Estudioso', 'Lee 25 personajes.', 'silver', 25, (c) => c.readCount),
  ]

  if (total) {
    defs.push({
      id: 'read-all', title: 'Completista', desc: `Lee los ${total} personajes.`, tier: 'gold',
      check: (c) => c.summary.every((s) => c.readIds.has(s.id)),
      progress: (c) => ({ cur: c.summary.filter((s) => c.readIds.has(s.id)).length, max: total }),
    })
  }

  // Un logro por época (solo épocas con 3 o más personajes).
  const byEra = {}
  for (const s of summary) (byEra[s.era] ||= []).push(s.id)
  for (const [era, ids] of Object.entries(byEra)) {
    if (ids.length < 3) continue
    defs.push({
      id: `era-${era}`, title: `Experto en ${era}`, desc: `Lee todos los personajes de «${era}».`, tier: 'silver',
      check: (c) => ids.every((id) => c.readIds.has(id)),
      progress: (c) => ({ cur: ids.filter((id) => c.readIds.has(id)).length, max: ids.length }),
    })
  }

  defs.push(
    counter('quiz-1', 'Primer quiz', 'Completa un quiz.', 'bronze', 1, (c) => c.stats.quizzesPlayed),
    counter('quiz-5', 'Jugador constante', 'Completa 5 quizzes.', 'silver', 5, (c) => c.stats.quizzesPlayed),
    counter('perfect-1', 'Puntaje perfecto', 'Acierta todas las preguntas de un quiz (mínimo 5).', 'gold', 1, (c) => c.stats.perfectQuizzes),
    counter('streak-5', 'Racha de 5', 'Acierta 5 preguntas seguidas.', 'silver', 5, (c) => c.stats.bestStreak),
    counter('streak-10', 'Racha de 10', 'Acierta 10 preguntas seguidas.', 'gold', 10, (c) => c.stats.bestStreak),
    counter('correct-50', 'Memoria de elefante', 'Acumula 50 respuestas correctas.', 'silver', 50, (c) => c.stats.correct),
    counter('correct-200', 'Sabio de las Escrituras', 'Acumula 200 respuestas correctas.', 'gold', 200, (c) => c.stats.correct),
    counter('daily-1', 'Reto del día', 'Responde tu primer reto diario.', 'bronze', 1, (c) => c.stats.dailyDates.length),
    counter('daily-3', 'Constante', 'Responde el reto diario 3 días seguidos.', 'silver', 3, (c) => c.dailyStreak),
    counter('daily-7', 'Hábito', 'Responde el reto diario 7 días seguidos.', 'gold', 7, (c) => c.dailyStreak),
  )

  return defs
}
