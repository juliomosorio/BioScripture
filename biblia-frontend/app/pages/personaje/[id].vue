<template>
  <div class="font-sans text-slate-800 antialiased">
    
    <div v-if="pending" class="pt-20 pb-20 text-center text-indigo-500 animate-pulse font-semibold">
      Recopilando manuscritos...
    </div>
    
    <div v-else-if="error" class="pt-20 pb-20 text-center text-red-500">
      No se pudo encontrar la historia de este personaje.
    </div>

    <div v-else-if="character">
      
      <header class="relative h-80 md:h-96 w-full bg-slate-900 overflow-hidden flex items-center justify-center">
        <img 
          v-if="character.cover_url" 
          :src="character.cover_url" 
          :alt="character.name" 
          class="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        
        <div class="relative z-10 text-center px-4 max-w-4xl mx-auto mt-8">
          <span class="text-indigo-300 font-bold tracking-widest uppercase text-sm mb-4 block">
            {{ character.era }}
          </span>
          <h1 class="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 drop-shadow-lg">
            {{ character.name }}
          </h1>
          <p v-if="character.roles && character.roles.length" class="text-xl md:text-2xl text-slate-300 font-medium max-w-2xl mx-auto">
            {{ character.roles.join(' · ') }}
          </p>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 relative">
          
          <aside class="lg:col-span-3">
            <div class="sticky top-24 space-y-8">
              
              <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 class="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Datos Clave</h3>
                <dl class="space-y-4 text-sm">
                  <div>
                    <dt class="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1">Época</dt>
                    <dd class="text-slate-800 font-medium">{{ character.era }}</dd>
                  </div>
                  
                  <div>
                    <dt class="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1">Libros</dt>
                    <dd class="flex flex-wrap gap-1.5">
                      <a 
                        v-for="book in character.books_referenced" 
                        :key="book"
                        :href="`https://www.biblegateway.com/passage/?search=${encodeURIComponent(book)}+1&version=RVR1960`"
                        target="_blank"
                        class="text-xs bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 px-2.5 py-1 rounded-md font-bold transition-all flex items-center gap-1"
                      >
                        {{ book }}
                        <svg class="w-2.5 h-2.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>

              <div v-if="character.related_characters && character.related_characters.length" class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 class="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Otras Conexiones</h3>
                <ul class="space-y-2">
                  <li v-for="rel in character.related_characters" :key="rel" class="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <div class="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                    {{ rel }}
                  </li>
                </ul>
              </div>
            </div>
          </aside>

          <article class="lg:col-span-6">
            <div class="prose prose-slate prose-lg lg:prose-xl max-w-none">
              <div v-for="(section, index) in character.story_sections" :key="index" class="mb-12">
                <h2 class="font-extrabold text-slate-900 tracking-tight">{{ section.heading }}</h2>
                <p class="leading-relaxed text-slate-700 whitespace-pre-line">{{ section.content }}</p>
              </div>
            </div>
          </article>

          <aside class="lg:col-span-3">
            <div class="sticky top-24 space-y-6">
              <h3 class="font-bold text-slate-400 uppercase tracking-widest text-xs mb-4">Análisis Bíblico</h3>
              
              <VerseCard 
                v-for="(verse, index) in character.key_verses" 
                :key="index" 
                :verse="verse" 
              />
              
              <HistoricalContextBox />
              
              <HistoricalMapBox 
                v-if="character.locations && character.locations.length > 0" 
                :locations="character.locations" 
              />

              <FamilyTreeBox 
                :character="character" 
              />
              
            </div>
          </aside>

        </div>
      </main>

    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const characterId = route.params.id

const { data: character, pending, error } = await useFetch(`http://localhost:8000/characters/${characterId}`)
</script>