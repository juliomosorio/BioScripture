<template>
  <div class="max-w-4xl mx-auto px-4 py-12">

    <div v-if="!authed" class="max-w-sm mx-auto bg-surface rounded-3xl shadow-xl border border-line p-8 text-center">
      <div class="w-12 h-12 rounded-2xl bg-ink text-white flex items-center justify-center mx-auto mb-4">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm0 0v5m6-5a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </div>
      <h1 class="text-xl font-black text-ink mb-2">Acceso de Administración</h1>
      <p class="text-ink-faint text-sm mb-6">Ingresa la contraseña para editar el registro histórico.</p>
      <form @submit.prevent="login" class="space-y-3">
        <input v-model="passwordInput" type="password" placeholder="Contraseña" autofocus class="w-full bg-parchment-soft border border-line rounded-xl px-4 py-3 text-center focus:ring-2 focus:ring-brand-400 focus:outline-none" />
        <button type="submit" :disabled="verifying" class="w-full bg-ink hover:bg-brand-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
          {{ verifying ? 'Verificando...' : 'Entrar' }}
        </button>
        <p v-if="loginError" class="text-red-500 text-sm font-semibold">{{ loginError }}</p>
      </form>
    </div>

    <div v-else class="bg-surface rounded-3xl shadow-xl border border-line p-8 sm:p-12">

      <div class="flex justify-between items-start mb-8">
        <div>
          <h1 class="text-3xl font-black text-ink mb-2">Panel de Administración</h1>
          <p class="text-ink-faint">
            {{ isEditing ? 'Editando un registro histórico existente.' : 'Ingresa un nuevo personaje al registro histórico.' }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <span v-if="isEditing" class="bg-amber-100 text-amber-700 font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            MODO EDICIÓN
          </span>
          <button @click="logout" type="button" class="text-xs font-bold text-ink-faint hover:text-red-500 transition-colors">Cerrar sesión</button>
        </div>
      </div>

      <form @submit.prevent="submitCharacter" class="space-y-8">
        
        <section class="bg-parchment-soft p-6 rounded-2xl border border-line">
          <h2 class="text-sm font-bold text-brand-600 uppercase tracking-widest mb-4">1. Identificación</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-bold text-ink-faint uppercase tracking-wider mb-2">ID Único</label>
              <div class="flex gap-2">
                <input v-model="form.id" type="text" placeholder="ej: moises" class="w-full bg-surface border border-line rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-400 focus:outline-none disabled:bg-parchment-soft disabled:text-ink-faint" required :disabled="isEditing" />
                <button v-if="!isEditing" type="button" @click="loadCharacter" class="bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold px-4 py-3 rounded-xl transition-colors whitespace-nowrap">Buscar</button>
                <button v-else type="button" @click="cancelEdit" class="bg-line-soft hover:bg-line text-ink-soft font-bold px-4 py-3 rounded-xl transition-colors whitespace-nowrap">Cancelar</button>
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-ink-faint uppercase tracking-wider mb-2">Nombre Completo</label>
              <input v-model="form.name" type="text" placeholder="ej: Moisés" class="w-full bg-surface border border-line rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-400 focus:outline-none" required />
            </div>
            <div class="md:col-span-2">
              <label class="block text-xs font-bold text-ink-faint uppercase tracking-wider mb-2">Época</label>
              <select v-model="form.era" class="w-full bg-surface border border-line rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-400 focus:outline-none" required>
                <option value="Inicios">Inicios</option>
                <option value="Mundo Antiguo">Mundo Antiguo</option>
                <option value="Patriarcas">Patriarcas</option>
                <option value="Éxodo">Éxodo</option>
                <option value="Jueces">Jueces</option>
                <option value="Reyes y Profetas">Reyes y Profetas</option>
                <option value="Nuevo Testamento">Nuevo Testamento</option>
              </select>
            </div>
          </div>
        </section>

        <section class="bg-parchment-soft p-6 rounded-2xl border border-line">
          <h2 class="text-sm font-bold text-brand-600 uppercase tracking-widest mb-4">2. Contexto y Enlaces (Separar por comas)</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-bold text-ink-faint uppercase tracking-wider mb-2">Libros</label>
              <input v-model="inputs.books" type="text" placeholder="Éxodo, Levítico" class="w-full bg-surface border border-line rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-400 focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-bold text-ink-faint uppercase tracking-wider mb-2">Roles</label>
              <input v-model="inputs.roles" type="text" placeholder="Profeta, Líder" class="w-full bg-surface border border-line rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-400 focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-bold text-ink-faint uppercase tracking-wider mb-2">Retrato (URL)</label>
              <input v-model="form.portrait_url" type="url" class="w-full bg-surface border border-line rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-400 focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-bold text-ink-faint uppercase tracking-wider mb-2">Portada (URL)</label>
              <input v-model="form.cover_url" type="url" class="w-full bg-surface border border-line rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-400 focus:outline-none" />
            </div>
          </div>
        </section>

        <section class="bg-parchment-soft p-6 rounded-2xl border border-line">
          <h2 class="text-sm font-bold text-brand-600 uppercase tracking-widest mb-4">3. Árbol Genealógico (Separar por comas)</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-bold text-ink-faint uppercase tracking-wider mb-2">Padres</label>
              <input v-model="inputs.parents" type="text" placeholder="Amram, Jocabed" class="w-full bg-surface border border-line rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-400 focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-bold text-ink-faint uppercase tracking-wider mb-2">Cónyuges</label>
              <input v-model="inputs.spouses" type="text" placeholder="Séfora" class="w-full bg-surface border border-line rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-400 focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-bold text-ink-faint uppercase tracking-wider mb-2">Hijos</label>
              <input v-model="inputs.children" type="text" placeholder="Gersón, Eliezer" class="w-full bg-surface border border-line rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-400 focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-bold text-ink-faint uppercase tracking-wider mb-2">Hermanos</label>
              <input v-model="inputs.siblings" type="text" placeholder="Aarón, María" class="w-full bg-surface border border-line rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-400 focus:outline-none" />
            </div>
            <div class="md:col-span-2">
              <label class="block text-xs font-bold text-ink-faint uppercase tracking-wider mb-2">Otras Conexiones Relevantes</label>
              <input v-model="inputs.related" type="text" placeholder="Josué, Faraón" class="w-full bg-surface border border-line rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-400 focus:outline-none" />
            </div>
          </div>
        </section>

        <section class="bg-parchment-soft p-6 rounded-2xl border border-line">
          <h2 class="text-sm font-bold text-brand-600 uppercase tracking-widest mb-4">4. Narrativa</h2>
          <textarea v-model="inputs.story" rows="4" placeholder="Redacta la historia..." class="w-full bg-surface border border-line rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-400 focus:outline-none"></textarea>
        </section>

        <section class="bg-parchment-soft p-6 rounded-2xl border border-line">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-sm font-bold text-brand-600 uppercase tracking-widest">5. Versículos Bíblicos</h2>
            <button type="button" @click="addVerseField" class="text-xs bg-brand-600 text-white font-bold px-3 py-1.5 rounded-lg">+ Agregar Versículo</button>
          </div>
          <div class="space-y-4">
            <div v-for="(verse, index) in dynamicVerses" :key="'verse'+index" class="bg-surface p-4 rounded-xl border border-line relative">
              <button type="button" @click="removeVerseField(index)" class="absolute top-2 right-3 text-xs font-bold text-red-400">Eliminar</button>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div class="md:col-span-1">
                  <input v-model="verse.reference" type="text" placeholder="Ej: Éxodo 3:14" class="w-full bg-parchment-soft border border-line rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-400 focus:outline-none" required />
                </div>
                <div class="md:col-span-2">
                  <input v-model="verse.text" type="text" placeholder="Y respondió Dios a Moisés: YO SOY EL QUE SOY..." class="w-full bg-parchment-soft border border-line rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-400 focus:outline-none" required />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="bg-parchment-soft p-6 rounded-2xl border border-line">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-sm font-bold text-brand-600 uppercase tracking-widest">6. Trayectoria Geográfica</h2>
            <button type="button" @click="addLocationField" class="text-xs bg-brand-600 text-white font-bold px-3 py-1.5 rounded-lg">+ Agregar Parada</button>
          </div>
          <div class="space-y-4">
            <div v-for="(loc, index) in dynamicLocations" :key="'loc'+index" class="bg-surface p-4 rounded-xl border border-line relative">
              <button type="button" @click="removeLocationField(index)" class="absolute top-2 right-3 text-xs font-bold text-red-400">Eliminar</button>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label class="block text-[10px] font-bold text-ink-faint uppercase tracking-wider mb-1">Punto {{ index + 1 }}</label>
                  <input v-model="loc.name" type="text" placeholder="Ej: Madián" class="w-full bg-parchment-soft border border-line rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-400" />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-ink-faint uppercase tracking-wider mb-1">Latitud</label>
                  <input v-model="loc.lat" type="number" step="any" class="w-full bg-parchment-soft border border-line rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-400" />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-ink-faint uppercase tracking-wider mb-1">Longitud</label>
                  <input v-model="loc.lng" type="number" step="any" class="w-full bg-parchment-soft border border-line rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <button type="submit" :disabled="isSubmitting" :class="isEditing ? 'bg-amber-500 hover:bg-amber-600' : 'bg-ink hover:bg-brand-600'" class="w-full text-white font-bold py-4 rounded-xl transition-colors shadow-lg disabled:opacity-50">
          {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar Personaje' : 'Crear Personaje') }}
        </button>

        <div v-if="message" :class="message.includes('Error') || message.includes('No encontrado') ? 'text-red-500 bg-red-50' : 'text-green-600 bg-green-50'" class="p-4 rounded-xl font-bold text-center border">
          {{ message }}
        </div>
      </form>

      <div class="mt-12 pt-12 border-t border-line">
        <h2 class="text-xl font-black text-ink mb-2">Carga Masiva con IA</h2>
        <p class="text-ink-faint mb-6">Pega aquí el arreglo JSON completo generado por la IA para guardarlo masivamente. Soporta los nuevos campos de genealogía.</p>
        <div class="space-y-4">
          <textarea v-model="bulkJsonText" rows="10" placeholder="[ { 'id': 'moises', 'parents': ['Amram'], ... } ]" class="w-full bg-parchment-soft border border-line rounded-2xl p-4 font-mono text-xs focus:ring-2 focus:ring-brand-400 focus:outline-none"></textarea>
          <button @click="submitBulkCharacters" :disabled="isBulkSubmitting" class="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 shadow-md">
            {{ isBulkSubmitting ? 'Procesando bloque de datos...' : 'Subir Todos los Personajes a la vez' }}
          </button>
          <div v-if="bulkMessage" :class="bulkMessage.includes('Error') ? 'text-red-500 bg-red-50' : 'text-green-600 bg-green-50'" class="p-4 rounded-xl font-bold text-center border">
            {{ bulkMessage }}
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

useHead({ title: 'Administración' })

const config = useRuntimeConfig()
const apiBase = config.public.apiBase

// --- Acceso por contraseña ---
const authed = ref(false)
const passwordInput = ref('')
const verifying = ref(false)
const loginError = ref('')

const adminHeaders = () => ({ 'X-Admin-Token': sessionStorage.getItem('admin_token') || '' })

onMounted(() => {
  const saved = sessionStorage.getItem('admin_token')
  if (saved) verifyToken(saved)
})

const verifyToken = async (token) => {
  verifying.value = true
  loginError.value = ''
  try {
    await $fetch(`${apiBase}/admin/verify`, { headers: { 'X-Admin-Token': token } })
    sessionStorage.setItem('admin_token', token)
    authed.value = true
  } catch (error) {
    sessionStorage.removeItem('admin_token')
    authed.value = false
    if (token) loginError.value = 'Contraseña incorrecta.'
  } finally {
    verifying.value = false
  }
}

const login = () => verifyToken(passwordInput.value)

const logout = () => {
  sessionStorage.removeItem('admin_token')
  authed.value = false
  passwordInput.value = ''
}

const isEditing = ref(false)
const isSubmitting = ref(false)
const message = ref('')

const bulkJsonText = ref('')
const isBulkSubmitting = ref(false)
const bulkMessage = ref('')

const form = ref({
  id: '', name: '', era: 'Patriarcas', portrait_url: '', cover_url: '',
  books_referenced: [], roles: [], key_verses: [], story_sections: [], 
  related_characters: [], locations: [],
  parents: [], spouses: [], children: [], siblings: []
})

const inputs = ref({ 
  books: '', roles: '', story: '', related: '',
  parents: '', spouses: '', children: '', siblings: ''
})
const dynamicVerses = ref([{ reference: '', text: '' }])
const dynamicLocations = ref([{ name: '', lat: '', lng: '' }])

const addVerseField = () => dynamicVerses.value.push({ reference: '', text: '' })
const removeVerseField = (index) => { if (dynamicVerses.value.length > 1) dynamicVerses.value.splice(index, 1) }

const addLocationField = () => dynamicLocations.value.push({ name: '', lat: '', lng: '' })
const removeLocationField = (index) => { if (dynamicLocations.value.length > 1) dynamicLocations.value.splice(index, 1) }

const stringToArray = (str) => {
  if (!str) return []
  return str.split(',').map(item => item.trim()).filter(item => item !== '')
}

const loadCharacter = async () => {
  if (!form.value.id) { message.value = 'Ingresa un ID.'; return }
  message.value = 'Buscando...'
  try {
    const data = await $fetch(`${apiBase}/characters/${form.value.id.toLowerCase()}`)
    form.value = { ...data }
    
    // Carga de campos clásicos
    inputs.value.books = data.books_referenced ? data.books_referenced.join(', ') : ''
    inputs.value.roles = data.roles ? data.roles.join(', ') : ''
    inputs.value.related = data.related_characters ? data.related_characters.join(', ') : ''
    inputs.value.story = data.story_sections && data.story_sections.length > 0 ? data.story_sections[0].content : ''
    
    // Carga de campos genealógicos
    inputs.value.parents = data.parents ? data.parents.join(', ') : ''
    inputs.value.spouses = data.spouses ? data.spouses.join(', ') : ''
    inputs.value.children = data.children ? data.children.join(', ') : ''
    inputs.value.siblings = data.siblings ? data.siblings.join(', ') : ''

    dynamicVerses.value = data.key_verses?.length ? [...data.key_verses] : [{ reference: '', text: '' }]
    dynamicLocations.value = data.locations?.length ? [...data.locations] : [{ name: '', lat: '', lng: '' }]

    isEditing.value = true
    message.value = 'Cargado correctamente.'
  } catch (error) {
    isEditing.value = false
    message.value = 'No encontrado.'
  }
}

const cancelEdit = () => {
  isEditing.value = false; message.value = ''
  form.value = { 
    id: '', name: '', era: 'Patriarcas', portrait_url: '', cover_url: '', 
    books_referenced: [], roles: [], key_verses: [], story_sections: [], 
    related_characters: [], locations: [],
    parents: [], spouses: [], children: [], siblings: []
  }
  inputs.value = { 
    books: '', roles: '', story: '', related: '',
    parents: '', spouses: '', children: '', siblings: ''
  }
  dynamicVerses.value = [{ reference: '', text: '' }]
  dynamicLocations.value = [{ name: '', lat: '', lng: '' }]
}

const submitCharacter = async () => {
  isSubmitting.value = true
  const payload = { ...form.value }
  
  // Procesamiento a Arreglos
  payload.books_referenced = stringToArray(inputs.value.books)
  payload.roles = stringToArray(inputs.value.roles)
  payload.related_characters = stringToArray(inputs.value.related)
  
  payload.parents = stringToArray(inputs.value.parents)
  payload.spouses = stringToArray(inputs.value.spouses)
  payload.children = stringToArray(inputs.value.children)
  payload.siblings = stringToArray(inputs.value.siblings)

  if (inputs.value.story) payload.story_sections = [{ heading: "La Historia", content: inputs.value.story }]

  payload.key_verses = dynamicVerses.value.filter(v => v.reference && v.text)
  
  payload.locations = dynamicLocations.value
    .filter(l => l.name && l.lat && l.lng)
    .map((l, idx) => ({ 
      name: l.name, 
      lat: parseFloat(l.lat), 
      lng: parseFloat(l.lng),
      order: idx + 1 
    }))

  try {
    const method = isEditing.value ? 'PUT' : 'POST'
    const url = isEditing.value ? `${apiBase}/characters/${payload.id}` : `${apiBase}/characters/`
    await $fetch(url, { method, body: payload, headers: adminHeaders() })
    message.value = isEditing.value ? '¡Actualizado con éxito!' : '¡Creado con éxito!'
    setTimeout(cancelEdit, 2000)
  } catch (error) {
    message.value = 'Error al guardar. Verifica la conexión o duplicidad de IDs.'
  } finally {
    isSubmitting.value = false
  }
}

const submitBulkCharacters = async () => {
  if (!bulkJsonText.value.trim()) {
    bulkMessage.value = 'Error: El campo está vacío.'
    return
  }
  isBulkSubmitting.value = true
  bulkMessage.value = ''
  try {
    const parsedData = JSON.parse(bulkJsonText.value)
    const res = await $fetch(`${apiBase}/characters/bulk/`, {
      method: 'POST',
      body: parsedData,
      headers: adminHeaders()
    })
    bulkMessage.value = `¡Carga masiva completada! Se procesaron ${res.length} personajes.`
    bulkJsonText.value = ''
  } catch (error) {
    if (error instanceof SyntaxError) {
      bulkMessage.value = 'Error: Formato JSON inválido.'
    } else {
      bulkMessage.value = 'Error al subir los datos masivos.'
    }
  } finally {
    isBulkSubmitting.value = false
  }
}
</script>