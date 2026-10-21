<template>
  <div class="min-h-screen bg-parchment py-16 px-4 sm:px-6 lg:px-8 font-sans text-ink">
    <div class="max-w-4xl mx-auto">

      <header class="text-center mb-12">
        <h2 class="text-brand-600 font-extrabold tracking-widest text-sm uppercase mb-3">Tu progreso</h2>
        <h1 class="font-serif text-5xl md:text-6xl font-black tracking-tight text-ink mb-4">Logros</h1>
        <p class="text-ink-faint text-sm">Se guardan en este navegador; no necesitas una cuenta.</p>
      </header>

      <ClientOnly>
        <section class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div v-for="s in stats" :key="s.label" class="bg-surface rounded-2xl border border-line p-5 text-center">
            <div class="font-serif text-3xl font-black text-brand-600">{{ s.value }}</div>
            <div class="text-[10px] font-bold text-ink-faint uppercase tracking-wider mt-1">{{ s.label }}</div>
          </div>
        </section>

        <p class="text-sm font-bold text-ink-soft mb-4">{{ unlockedCount }} de {{ defs.length }} logros desbloqueados</p>

        <section class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="b in defs" :key="b.id"
            class="bg-surface rounded-2xl border p-5 flex gap-4 transition-opacity"
            :class="isUnlocked(b) ? 'border-gold-300' : 'border-line opacity-70'"
          >
            <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" :class="isUnlocked(b) ? tierClass[b.tier] : 'bg-line-soft text-ink-faint'">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M5 3h14v4a7 7 0 01-14 0V3zM9 21h6M12 14v7M5 5H3v2a3 3 0 003 3M19 5h2v2a3 3 0 01-3 3"></path></svg>
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-bold text-ink">{{ b.title }}</p>
              <p class="text-sm text-ink-faint">{{ b.desc }}</p>
              <p v-if="isUnlocked(b)" class="text-[11px] font-semibold text-brand-600 mt-1.5">Desbloqueado el {{ formatDate(game.badges[b.id]) }}</p>
              <div v-else-if="b.progress" class="mt-2">
                <div class="h-1.5 rounded-full bg-line-soft overflow-hidden">
                  <div class="h-full bg-brand-500 rounded-full" :style="{ width: `${progressPct(b)}%` }"></div>
                </div>
                <p class="text-[11px] text-ink-faint mt-1">{{ progressOf(b).cur }} / {{ progressOf(b).max }}</p>
              </div>
            </div>
          </div>
        </section>
      </ClientOnly>

      <div class="text-center mt-12">
        <NuxtLink to="/quiz" class="inline-block px-6 py-3 bg-ink-fixed hover:bg-brand-600 text-white dark:bg-gold-400 dark:hover:bg-gold-300 dark:text-ink-fixed font-bold rounded-xl transition-colors">Jugar un quiz</NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Logros' })

const config = useRuntimeConfig()
const { data: summary } = await useFetch(`${config.public.apiBase}/characters/summary/`, { default: () => [], retry: 6, retryDelay: 3000 })
const { game, dailyStreak } = useGameProgress()
const { readIds } = useReadProgress()

const defs = computed(() => buildBadgeDefs(summary.value))
const ctx = computed(() => ({
  readIds: readIds.value, readCount: readIds.value.size, summary: summary.value,
  stats: game.value, dailyStreak: dailyStreak.value,
}))

const isUnlocked = (b) => !!game.value.badges[b.id]
const unlockedCount = computed(() => defs.value.filter(isUnlocked).length)
const progressOf = (b) => b.progress(ctx.value)
const progressPct = (b) => {
  const p = progressOf(b)
  return p.max ? Math.min(100, (p.cur / p.max) * 100) : 0
}

const tierClass = {
  bronze: 'bg-gold-100 text-gold-600',
  silver: 'bg-brand-100 text-brand-700',
  gold: 'bg-gold-400 text-ink-fixed',
}

const formatDate = (iso) => new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })

const stats = computed(() => {
  const g = game.value
  const acc = g.answered ? Math.round((g.correct / g.answered) * 100) : 0
  return [
    { label: 'Personajes leídos', value: `${readIds.value.size}/${summary.value.length}` },
    { label: 'Quizzes jugados', value: g.quizzesPlayed },
    { label: 'Aciertos', value: g.answered ? `${acc}%` : '-' },
    { label: 'Racha diaria', value: dailyStreak.value },
  ]
})
</script>
