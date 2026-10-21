// Progreso de juego (quizzes, reto diario, logros) guardado en el navegador.
const STORAGE_KEY = 'bioscripture_game'
const defaults = () => ({
  quizzesPlayed: 0, answered: 0, correct: 0, perfectQuizzes: 0, bestStreak: 0,
  bestScore: null, dailyDates: [], daily: {}, badges: {},
})
const game = ref(defaults())
const revision = ref(0) // sube con cada cambio; lo observa el evaluador de logros
let loaded = false

function ensureLoaded() {
  if (loaded || !import.meta.client) return
  loaded = true
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) game.value = { ...defaults(), ...JSON.parse(raw) }
  } catch {
    // localStorage no disponible; el progreso solo dura la sesión.
  }
}

function persist() {
  if (!import.meta.client) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(game.value))
  } catch {
    // no es crítico
  }
}

const touch = () => {
  revision.value++
  persist()
}

function calcStreak(dates) {
  const set = new Set(dates)
  const d = new Date()
  if (!set.has(todayKey(d))) d.setDate(d.getDate() - 1) // el día de hoy aún puede estar pendiente
  let n = 0
  while (set.has(todayKey(d))) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

export function useGameProgress() {
  ensureLoaded()

  const recordQuiz = ({ correct, total, bestStreak }) => {
    const g = game.value
    g.quizzesPlayed++
    g.answered += total
    g.correct += correct
    if (total >= 5 && correct === total) g.perfectQuizzes++
    g.bestStreak = Math.max(g.bestStreak, bestStreak)
    if (!g.bestScore || correct / total > g.bestScore.correct / g.bestScore.total) g.bestScore = { correct, total }
    touch()
  }

  const recordTrivia = (correct, total) => {
    game.value.answered += total
    game.value.correct += correct
    touch()
  }

  const recordDaily = (date, correct, answeredIndex) => {
    const g = game.value
    if (g.daily[date]) return
    g.daily[date] = { correct, answeredIndex }
    if (!g.dailyDates.includes(date)) g.dailyDates.push(date)
    g.answered++
    if (correct) g.correct++
    touch()
  }

  const unlockBadges = (ids) => {
    const now = new Date().toISOString()
    for (const id of ids) if (!game.value.badges[id]) game.value.badges[id] = now
    touch()
  }

  const dailyStreak = computed(() => {
    revision.value // dependencia explícita para recalcular tras cada cambio
    return calcStreak(game.value.dailyDates)
  })

  return { game, revision, dailyStreak, recordQuiz, recordTrivia, recordDaily, unlockBadges }
}
