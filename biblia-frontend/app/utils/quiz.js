// Motor de preguntas: genera preguntas de opción múltiple a partir de los datos
// reales de los personajes (época, roles, conexiones, versículos, lugares,
// libros). Nada está escrito a mano, así que cualquier personaje nuevo entra
// al quiz automáticamente. Todas las funciones aceptan un `rng` para poder
// generar el mismo reto del día para todos los usuarios (RNG con semilla).

export const ERA_ORDER = [
  'Inicios', 'Mundo Antiguo', 'Patriarcas', 'Éxodo', 'Jueces', 'Reyes y Profetas', 'Nuevo Testamento',
]
export const eraRank = (era) => {
  const i = ERA_ORDER.indexOf(era)
  return i === -1 ? ERA_ORDER.length : i
}

export const todayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export function hashString(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const mentions = (text, name) => new RegExp(`(^|[^a-z])${escapeRe(norm(name))}([^a-z]|$)`).test(norm(text))

const unique = (arr) => [...new Set(arr)]
const shuffle = (arr, rng) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
const pick = (arr, n, rng) => shuffle(arr, rng).slice(0, n)

function buildMC({ type, question, quote, correct, distractors, explanation, characterId }, rng) {
  const wrong = unique(distractors).filter((x) => x && x !== correct)
  if (wrong.length < 2) return null
  return {
    type,
    question,
    quote: quote || null,
    options: shuffle([{ label: correct, correct: true }, ...pick(wrong, 3, rng).map((label) => ({ label, correct: false }))], rng),
    explanation,
    characterId: characterId || null,
  }
}

// Distractores que son personajes: prioriza los de la misma época (más difíciles).
function characterDistractors(c, all, rng, exclude = []) {
  const others = all.filter((o) => o.id !== c.id && !exclude.includes(o.name))
  const same = pick(others.filter((o) => o.era === c.era), 2, rng)
  const rest = pick(others.filter((o) => !same.includes(o)), 3 - same.length, rng)
  return [...same, ...rest].map((o) => o.name)
}

const GENERATORS = {
  era(c, all, rng) {
    return buildMC({
      type: 'era',
      question: `¿En qué época vivió ${c.name}?`,
      correct: c.era,
      distractors: unique(all.map((o) => o.era)).filter((e) => e && e !== c.era),
      explanation: `${c.name} pertenece a la época «${c.era}».`,
      characterId: c.id,
    }, rng)
  },

  role(c, all, rng) {
    if (!c.roles?.length) return null
    const others = unique(all.filter((o) => o.id !== c.id).flatMap((o) => o.roles || [])).filter((r) => !c.roles.includes(r))
    return buildMC({
      type: 'role',
      question: `¿Cuál de estos roles corresponde a ${c.name}?`,
      correct: pick(c.roles, 1, rng)[0],
      distractors: others,
      explanation: `${c.name} es recordado como ${c.roles.join(', ')}.`,
      characterId: c.id,
    }, rng)
  },

  connection(c, all, rng) {
    const conns = unique([
      ...(c.related_characters || []), ...(c.parents || []), ...(c.spouses || []),
      ...(c.children || []), ...(c.siblings || []),
    ].filter(Boolean))
    if (!conns.length) return null
    const correct = pick(conns, 1, rng)[0]
    return buildMC({
      type: 'connection',
      question: `¿Quién está relacionado con ${c.name}?`,
      correct,
      distractors: characterDistractors(c, all, rng, conns),
      explanation: `${correct} forma parte de la historia de ${c.name}.`,
      characterId: c.id,
    }, rng)
  },

  verse(c, all, rng) {
    // Descarta versículos que nombran al personaje (serían demasiado obvios).
    const verses = (c.key_verses || []).filter((v) => v.text && !mentions(v.text, c.name))
    if (!verses.length) return null
    const v = pick(verses, 1, rng)[0]
    return buildMC({
      type: 'verse',
      question: '¿A qué personaje está asociado este versículo?',
      quote: v.text,
      correct: c.name,
      distractors: characterDistractors(c, all, rng),
      explanation: `${v.reference} aparece en la historia de ${c.name}.`,
      characterId: c.id,
    }, rng)
  },

  location(c, all, rng) {
    const places = unique((c.locations || []).map((l) => l.name).filter(Boolean))
    if (!places.length) return null
    const mine = places.map(norm)
    const others = unique(all.filter((o) => o.id !== c.id).flatMap((o) => (o.locations || []).map((l) => l.name))).filter((n) => n && !mine.includes(norm(n)))
    return buildMC({
      type: 'location',
      question: `¿Cuál de estos lugares aparece en la ruta de ${c.name}?`,
      correct: pick(places, 1, rng)[0],
      distractors: others,
      explanation: `La ruta de ${c.name} incluye ${places.join(', ')}.`,
      characterId: c.id,
    }, rng)
  },

  book(c, all, rng) {
    const books = unique(c.books_referenced || [])
    if (!books.length) return null
    const others = unique(all.filter((o) => o.id !== c.id).flatMap((o) => o.books_referenced || [])).filter((b) => !books.includes(b))
    return buildMC({
      type: 'book',
      question: `¿En cuál de estos libros aparece ${c.name}?`,
      correct: pick(books, 1, rng)[0],
      distractors: others,
      explanation: `${c.name} aparece en ${books.join(', ')}.`,
      characterId: c.id,
    }, rng)
  },

  truefalse(c, all, rng) {
    const otherEras = unique(all.map((o) => o.era)).filter((e) => e && e !== c.era)
    if (!otherEras.length) return null
    const isTrue = rng() < 0.5
    const era = isTrue ? c.era : pick(otherEras, 1, rng)[0]
    return {
      type: 'truefalse',
      question: `Verdadero o falso: ${c.name} pertenece a la época «${era}».`,
      quote: null,
      options: [{ label: 'Verdadero', correct: isTrue }, { label: 'Falso', correct: !isTrue }],
      explanation: `${c.name} pertenece a la época «${c.era}».`,
      characterId: c.id,
    }
  },

  first(c, all, rng) {
    const otherEras = pick(unique(all.map((o) => o.era)).filter((e) => e && e !== c.era), 2, rng)
    const group = [c, ...otherEras.map((e) => pick(all.filter((o) => o.era === e), 1, rng)[0])].filter(Boolean)
    if (group.length < 3) return null
    const ordered = [...group].sort((a, b) => eraRank(a.era) - eraRank(b.era))
    return {
      type: 'first',
      question: '¿Cuál de estos personajes vivió primero?',
      quote: null,
      options: shuffle(group, rng).map((o) => ({ label: o.name, correct: o.id === ordered[0].id })),
      explanation: `En orden cronológico: ${ordered.map((o) => `${o.name} (${o.era})`).join(' → ')}.`,
      characterId: ordered[0].id,
    }
  },
}

const TYPE_KEYS = Object.keys(GENERATORS)
const CHARACTER_TYPES = TYPE_KEYS.filter((t) => t !== 'first')

// Preguntas sobre un personaje (para el trivia al final de su historia).
export function buildCharacterQuiz(c, all, { count = 4, rng = Math.random } = {}) {
  const out = []
  for (const t of shuffle(CHARACTER_TYPES, rng)) {
    if (out.length >= count) break
    const q = GENERATORS[t](c, all, rng)
    if (q) out.push(q)
  }
  return out
}

// Quiz mezclado de varios personajes, opcionalmente limitado a una época.
export function buildMixedQuiz(all, { count = 10, era = '', rng = Math.random } = {}) {
  if (!all.length) return []
  const pool = era ? all.filter((c) => c.era === era) : all
  const base = pool.length ? pool : all
  let order = shuffle(base, rng)
  const out = []
  const seen = new Set()
  let lastType = null
  let idx = 0
  for (let guard = 0; out.length < count && guard < count * 30; guard++) {
    const c = order[idx % order.length]
    idx++
    if (idx % order.length === 0) order = shuffle(base, rng)
    const types = shuffle(TYPE_KEYS, rng).sort((a, b) => (a === lastType) - (b === lastType))
    for (const t of types) {
      const q = GENERATORS[t](c, all, rng)
      const key = q && `${q.question}|${q.quote || ''}`
      if (q && !seen.has(key)) {
        seen.add(key)
        out.push(q)
        lastType = t
        break
      }
    }
  }
  return out
}

// Personaje y pregunta del día: iguales para todos los usuarios ese día.
export function getDailyChallenge(all, key = todayKey()) {
  if (!all.length) return null
  const sorted = [...all].sort((a, b) => a.id.localeCompare(b.id))
  const character = sorted[Math.floor(mulberry32(hashString(key))() * sorted.length)]
  const rng = mulberry32(hashString(`${key}:q`))
  for (const t of shuffle(CHARACTER_TYPES, rng)) {
    const question = GENERATORS[t](character, all, rng)
    if (question) return { character, question }
  }
  return { character, question: null }
}
