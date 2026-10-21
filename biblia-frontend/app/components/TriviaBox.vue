<template>
  <div v-if="questions.length" class="bg-surface rounded-2xl border border-line shadow-sm p-6 md:p-8 mt-12">
    <h3 class="font-serif text-2xl font-black text-ink mb-1">¿Cuánto recuerdas?</h3>
    <p class="text-sm text-ink-faint mb-6">Pon a prueba lo que acabas de leer sobre {{ character.name }}.</p>

    <div class="space-y-8">
      <QuizQuestion
        v-for="(q, qi) in questions"
        :key="`${round}-${qi}`"
        :question="q"
        :number="qi + 1"
        :answered="answers[qi]"
        @answer="(oi) => answer(qi, oi)"
      />
    </div>

    <div v-if="allAnswered" class="mt-8 pt-6 border-t border-line text-center">
      <p class="font-bold text-ink">Obtuviste {{ score }} de {{ questions.length }} correctas</p>
      <div class="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-2 text-sm font-semibold">
        <button @click="reset" class="text-brand-600 hover:text-brand-700">Intentar con otras preguntas</button>
        <NuxtLink to="/quiz" class="text-brand-600 hover:text-brand-700">Jugar un quiz completo &rarr;</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  character: { type: Object, required: true },
})

const { data: all } = useAllCharacters({ server: false, lazy: true })
const { recordTrivia } = useGameProgress()

const questions = ref([])
const answers = ref([])
const round = ref(0)
let recorded = false

const build = () => {
  if (!all.value.length) return
  questions.value = buildCharacterQuiz(props.character, all.value, { count: 4 })
  answers.value = questions.value.map(() => null)
  recorded = false
  round.value++
}

watch(all, build, { immediate: true })

const answer = (qi, oi) => {
  if (answers.value[qi] !== null) return
  answers.value[qi] = oi
}

const allAnswered = computed(() => questions.value.length > 0 && answers.value.every((a) => a !== null))
const score = computed(() => questions.value.filter((q, i) => q.options[answers.value[i]]?.correct).length)

watch(allAnswered, (done) => {
  if (done && !recorded) {
    recorded = true
    recordTrivia(score.value, questions.value.length)
  }
})

const reset = build
</script>
