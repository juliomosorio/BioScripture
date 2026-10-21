<template>
  <div>
    <p class="font-semibold text-ink mb-3">{{ number ? `${number}. ` : '' }}{{ question.question }}</p>

    <blockquote v-if="question.quote" class="font-serif italic text-ink-soft text-sm leading-relaxed border-l-4 border-gold-400 pl-4 mb-4">
      &ldquo;{{ question.quote }}&rdquo;
    </blockquote>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <button
        v-for="(opt, oi) in question.options"
        :key="oi"
        @click="$emit('answer', oi)"
        :disabled="isAnswered"
        class="text-left text-sm px-4 py-2.5 rounded-xl border transition-colors disabled:cursor-default"
        :class="optionClass(oi)"
      >
        {{ opt.label }}
      </button>
    </div>

    <div v-if="isAnswered" class="mt-3 rounded-xl bg-parchment-soft border border-line p-4 text-sm">
      <p class="font-bold" :class="isCorrect ? 'text-brand-600' : 'text-red-500'">
        {{ isCorrect ? 'Correcto' : `No exactamente. Era: ${correctLabel}` }}
      </p>
      <p class="text-ink-soft mt-1 leading-relaxed">{{ question.explanation }}</p>
      <NuxtLink v-if="question.characterId" :to="`/personaje/${question.characterId}`" class="inline-block mt-2 font-semibold text-brand-600 hover:text-brand-700 transition-colors">
        Leer su historia &rarr;
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  question: { type: Object, required: true },
  answered: { type: Number, default: null }, // índice elegido, o null si aún no responde
  number: { type: Number, default: 0 },
})
defineEmits(['answer'])

const isAnswered = computed(() => props.answered !== null && props.answered !== undefined)
const isCorrect = computed(() => isAnswered.value && props.question.options[props.answered]?.correct)
const correctLabel = computed(() => props.question.options.find((o) => o.correct)?.label)

const optionClass = (oi) => {
  if (!isAnswered.value) return 'border-line hover:border-brand-300 hover:bg-brand-50/50 text-ink-soft'
  if (props.question.options[oi].correct) return 'border-brand-400 bg-brand-50 text-brand-700 font-semibold'
  if (oi === props.answered) return 'border-red-400 bg-red-500/10 text-red-500'
  return 'border-line text-ink-faint opacity-60'
}
</script>
