<template>
  <div v-if="questions.length" class="bg-surface rounded-2xl border border-line shadow-sm p-6 md:p-8 mt-12">
    <h3 class="font-serif text-2xl font-black text-ink mb-1">¿Cuánto recuerdas?</h3>
    <p class="text-sm text-ink-faint mb-6">Pon a prueba lo que acabas de leer sobre {{ characterName }}.</p>

    <div class="space-y-6">
      <div v-for="(q, qi) in questions" :key="qi">
        <p class="font-semibold text-ink mb-3">{{ qi + 1 }}. {{ q.question }}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            v-for="(opt, oi) in q.options"
            :key="oi"
            @click="select(qi, oi)"
            :disabled="q.answered !== null && q.answered !== undefined"
            class="text-left text-sm px-4 py-2.5 rounded-xl border transition-colors disabled:cursor-default"
            :class="optionClass(q, oi)"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="allAnswered" class="mt-6 pt-6 border-t border-line text-center">
      <p class="font-bold text-ink">Obtuviste {{ score }} de {{ questions.length }} correctas</p>
      <button @click="reset" class="mt-2 text-sm font-semibold text-brand-600 hover:text-brand-700">Intentar de nuevo</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  character: { type: Object, required: true },
  pool: { type: Array, default: () => [] } // resumen de todos los personajes: /characters/summary/
})

const characterName = computed(() => props.character?.name || '')

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)
const pick = (arr, n) => shuffle(arr).slice(0, n)

const buildQuestions = () => {
  const c = props.character
  const others = (props.pool || []).filter(p => p.id !== c.id)
  const qs = []

  // 1) Época
  const eraDistractors = pick([...new Set(others.map(o => o.era).filter(e => e && e !== c.era))], 3)
  if (eraDistractors.length >= 2) {
    qs.push({
      question: `¿En qué época vivió ${c.name}?`,
      options: shuffle([
        { label: c.era, correct: true },
        ...eraDistractors.map(e => ({ label: e, correct: false })),
      ]),
      answered: null,
    })
  }

  // 2) Rol
  if (c.roles?.length) {
    const correctRole = pick(c.roles, 1)[0]
    const otherRoles = [...new Set(others.flatMap(o => o.roles || []))].filter(r => !c.roles.includes(r))
    const roleDistractors = pick(otherRoles, 3)
    if (correctRole && roleDistractors.length >= 2) {
      qs.push({
        question: `¿Cuál de estos roles corresponde a ${c.name}?`,
        options: shuffle([
          { label: correctRole, correct: true },
          ...roleDistractors.map(r => ({ label: r, correct: false })),
        ]),
        answered: null,
      })
    }
  }

  // 3) Conexión / familia
  const connections = [
    ...(c.related_characters || []),
    ...(c.parents || []), ...(c.spouses || []), ...(c.children || []), ...(c.siblings || []),
  ].filter(Boolean)
  const uniqueConnections = [...new Set(connections)]
  if (uniqueConnections.length) {
    const correctConn = pick(uniqueConnections, 1)[0]
    const connNames = others.map(o => o.name).filter(n => !uniqueConnections.includes(n) && n !== c.name)
    const connDistractors = pick(connNames, 3)
    if (connDistractors.length >= 2) {
      qs.push({
        question: `¿Quién está relacionado con ${c.name}?`,
        options: shuffle([
          { label: correctConn, correct: true },
          ...connDistractors.map(n => ({ label: n, correct: false })),
        ]),
        answered: null,
      })
    }
  }

  return qs
}

const questions = ref(buildQuestions())

const select = (qi, oi) => {
  if (questions.value[qi].answered !== null && questions.value[qi].answered !== undefined) return
  questions.value[qi].answered = oi
}

const optionClass = (q, oi) => {
  const answered = q.answered !== null && q.answered !== undefined
  if (!answered) return 'border-line hover:border-brand-300 hover:bg-brand-50/50 text-ink-soft'
  const opt = q.options[oi]
  if (opt.correct) return 'border-brand-400 bg-brand-50 text-brand-700 font-semibold'
  if (oi === q.answered) return 'border-red-300 bg-red-50 text-red-600'
  return 'border-line text-ink-faint opacity-60'
}

const allAnswered = computed(() => questions.value.length > 0 && questions.value.every(q => q.answered !== null && q.answered !== undefined))
const score = computed(() => questions.value.filter(q => q.options[q.answered]?.correct).length)

const reset = () => {
  questions.value = buildQuestions()
}
</script>
