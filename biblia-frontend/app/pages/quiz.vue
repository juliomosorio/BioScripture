<template>
  <div class="min-h-screen bg-parchment py-16 px-4 sm:px-6 lg:px-8 font-sans text-ink">
    <div class="max-w-2xl mx-auto">

      <header class="text-center mb-10">
        <h2 class="text-brand-600 font-extrabold tracking-widest text-sm uppercase mb-3">Pon a prueba tu conocimiento</h2>
        <h1 class="font-serif text-5xl md:text-6xl font-black tracking-tight text-ink">Quiz</h1>
      </header>

      <!-- Configuración -->
      <section v-if="phase === 'setup'" class="bg-surface rounded-3xl border border-line shadow-sm p-8 md:p-10">
        <p class="text-ink-soft leading-relaxed mb-8">
          Preguntas sobre versículos, lugares, libros, familias y cronología, mezclando personajes.
          Cada respuesta te explica el porqué y te lleva a la historia correspondiente.
        </p>

        <p class="text-xs font-bold uppercase tracking-wider text-ink-faint mb-3">Época</p>
        <div class="flex flex-wrap gap-2 mb-8">
          <button
            v-for="e in ['', ...eras]" :key="e || 'all'" @click="settings.era = e"
            :class="settings.era === e ? 'bg-brand-600 text-white' : 'bg-surface text-ink-soft hover:bg-parchment-soft border border-line'"
            class="px-4 py-1.5 rounded-full text-sm font-bold transition-colors"
          >{{ e || 'Todas' }}</button>
        </div>

        <p class="text-xs font-bold uppercase tracking-wider text-ink-faint mb-3">Cantidad de preguntas</p>
        <div class="flex gap-2 mb-10">
          <button
            v-for="n in [5, 10, 15]" :key="n" @click="settings.count = n"
            :class="settings.count === n ? 'bg-brand-600 text-white' : 'bg-surface text-ink-soft hover:bg-parchment-soft border border-line'"
            class="px-5 py-1.5 rounded-full text-sm font-bold transition-colors"
          >{{ n }}</button>
        </div>

        <button @click="start" :disabled="!allCharacters.length" class="w-full bg-ink-fixed hover:bg-brand-600 text-white dark:bg-gold-400 dark:hover:bg-gold-300 dark:text-ink-fixed font-bold py-4 rounded-xl transition-colors disabled:opacity-50">
          {{ allCharacters.length ? 'Comenzar' : 'Cargando personajes...' }}
        </button>

        <ClientOnly>
          <p v-if="game.bestScore" class="text-center text-sm text-ink-faint mt-5">
            Tu mejor resultado: {{ game.bestScore.correct }} de {{ game.bestScore.total }} &middot; {{ game.quizzesPlayed }} quizzes jugados
          </p>
        </ClientOnly>
      </section>

      <!-- Partida -->
      <section v-else-if="phase === 'playing'" class="bg-surface rounded-3xl border border-line shadow-sm p-6 md:p-10">
        <div class="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-ink-faint mb-2">
          <span>Pregunta {{ current + 1 }} de {{ questions.length }}</span>
          <span>Racha: {{ streak }}</span>
        </div>
        <div class="h-1.5 rounded-full bg-line-soft overflow-hidden mb-8">
          <div class="h-full bg-brand-500 rounded-full transition-all duration-300" :style="{ width: `${((current + (answers[current] !== null ? 1 : 0)) / questions.length) * 100}%` }"></div>
        </div>

        <QuizQuestion :key="current" :question="questions[current]" :answered="answers[current]" @answer="answer" />

        <button v-if="answers[current] !== null" @click="next" class="mt-6 w-full bg-ink-fixed hover:bg-brand-600 text-white dark:bg-gold-400 dark:hover:bg-gold-300 dark:text-ink-fixed font-bold py-3.5 rounded-xl transition-colors">
          {{ current < questions.length - 1 ? 'Siguiente' : 'Ver resultado' }}
        </button>
      </section>

      <!-- Resultado -->
      <section v-else class="bg-surface rounded-3xl border border-line shadow-sm p-8 md:p-10 text-center">
        <p class="text-xs font-bold uppercase tracking-wider text-ink-faint mb-2">Tu resultado</p>
        <p class="font-serif text-7xl font-black text-brand-600">{{ score }}<span class="text-3xl text-ink-faint">/{{ questions.length }}</span></p>
        <p class="text-ink-soft mt-3 mb-2">{{ verdict }}</p>
        <p class="text-sm text-ink-faint mb-8">Mejor racha de esta partida: {{ bestRun }}</p>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button @click="phase = 'setup'" class="px-6 py-3 bg-ink-fixed hover:bg-brand-600 text-white dark:bg-gold-400 dark:hover:bg-gold-300 dark:text-ink-fixed font-bold rounded-xl transition-colors">Jugar de nuevo</button>
          <a :href="whatsappUrl" target="_blank" rel="noopener" class="px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-colors">Compartir resultado</a>
        </div>
        <NuxtLink to="/logros" class="inline-block mt-6 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">Ver mis logros &rarr;</NuxtLink>
      </section>

    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Quiz' })

const config = useRuntimeConfig()
const { data: allCharacters } = await useAllCharacters()
const { data: eras } = await useFetch(`${config.public.apiBase}/characters/eras/`, { default: () => [], retry: 6, retryDelay: 3000 })
const { game, recordQuiz } = useGameProgress()
const requestUrl = useRequestURL()

const phase = ref('setup') // setup | playing | done
const settings = reactive({ era: '', count: 10 })
const questions = ref([])
const answers = ref([])
const current = ref(0)
const streak = ref(0)
const bestRun = ref(0)

const start = () => {
  questions.value = buildMixedQuiz(allCharacters.value, { count: settings.count, era: settings.era })
  if (!questions.value.length) return
  answers.value = questions.value.map(() => null)
  current.value = 0
  streak.value = 0
  bestRun.value = 0
  phase.value = 'playing'
}

const answer = (oi) => {
  if (answers.value[current.value] !== null) return
  answers.value[current.value] = oi
  if (questions.value[current.value].options[oi].correct) {
    streak.value++
    bestRun.value = Math.max(bestRun.value, streak.value)
  } else {
    streak.value = 0
  }
}

const score = computed(() => questions.value.filter((q, i) => q.options[answers.value[i]]?.correct).length)

const next = () => {
  if (current.value < questions.value.length - 1) {
    current.value++
    return
  }
  recordQuiz({ correct: score.value, total: questions.value.length, bestStreak: bestRun.value })
  phase.value = 'done'
}

const verdict = computed(() => {
  const pct = score.value / (questions.value.length || 1)
  if (pct === 1) return 'Puntaje perfecto. Conoces muy bien estas historias.'
  if (pct >= 0.7) return 'Muy bien. Tienes buen dominio del tema.'
  if (pct >= 0.4) return 'Buen comienzo. Lee un poco más y vuelve a intentarlo.'
  return 'Cada partida enseña algo. Revisa las historias y prueba de nuevo.'
})

const whatsappUrl = computed(() => {
  const text = `Saqué ${score.value}/${questions.value.length} en el quiz de BioScripture. ¿Puedes superarme? 👉 ${requestUrl.origin}/quiz`
  return `https://wa.me/?text=${encodeURIComponent(text)}`
})
</script>
