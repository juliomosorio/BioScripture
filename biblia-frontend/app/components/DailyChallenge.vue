<template>
  <section v-if="challenge && challenge.question" class="max-w-3xl mx-auto mb-14 bg-surface rounded-3xl border border-line shadow-sm overflow-hidden">
    <div class="bg-brand-50 border-b border-line px-6 md:px-8 py-4 flex items-center justify-between gap-4">
      <p class="text-xs font-extrabold tracking-widest uppercase text-brand-600">Reto del día</p>
      <p class="text-xs font-bold text-ink-soft">
        Racha: {{ dailyStreak }} {{ dailyStreak === 1 ? 'día' : 'días' }}
      </p>
    </div>

    <div class="p-6 md:p-8">
      <NuxtLink :to="`/personaje/${challenge.character.id}`" class="flex items-center gap-4 mb-6 group">
        <div class="w-14 h-14 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 flex-shrink-0">
          <div class="w-7 h-7"><CharacterIcon :roles="challenge.character.roles" /></div>
        </div>
        <div class="min-w-0">
          <p class="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Personaje del día</p>
          <p class="font-serif text-2xl font-black text-ink group-hover:text-brand-600 transition-colors">{{ challenge.character.name }}</p>
          <p class="text-xs text-ink-faint">{{ challenge.character.era }}</p>
        </div>
      </NuxtLink>

      <QuizQuestion :question="challenge.question" :answered="answeredIndex" @answer="answer" />

      <p v-if="answeredIndex !== null" class="text-sm text-ink-faint mt-4">
        Vuelve mañana para un nuevo reto y mantener tu racha.
      </p>
    </div>
  </section>
</template>

<script setup>
const { data: all } = useAllCharacters({ server: false, lazy: true })
const { game, dailyStreak, recordDaily } = useGameProgress()

const date = todayKey()
const challenge = computed(() => getDailyChallenge(all.value, date))

const answeredIndex = computed(() => {
  const saved = game.value.daily[date]
  return saved ? saved.answeredIndex : null
})

const answer = (oi) => {
  if (answeredIndex.value !== null || !challenge.value?.question) return
  recordDaily(date, !!challenge.value.question.options[oi]?.correct, oi)
}
</script>
