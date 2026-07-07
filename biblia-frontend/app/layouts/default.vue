<template>
  <div class="min-h-screen flex flex-col bg-[#F8FAFC]">
    
    <nav class="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <NuxtLink to="/" class="flex items-center gap-2 cursor-pointer group">
            <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-700 transition-colors">
              <span class="text-white font-bold font-serif">H</span>
            </div>
            <span class="font-black text-xl tracking-tight text-slate-900">Historia Sagrada</span>
          </NuxtLink>
          
          <div class="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
            <NuxtLink to="/" class="hover:text-indigo-600 transition-colors">Inicio</NuxtLink>
            <span class="hover:text-indigo-600 transition-colors cursor-pointer">Personajes</span>
            <span class="hover:text-indigo-600 transition-colors cursor-pointer">Épocas</span>
            
            <div class="relative ml-4">
              <input type="text" placeholder="Buscar personaje..." class="bg-slate-100 border-none rounded-full py-1.5 pl-4 pr-10 text-sm focus:ring-2 focus:ring-indigo-500 w-48 transition-all" />
              <svg class="w-4 h-4 text-slate-400 absolute right-3 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="flex-grow pt-16">
      <slot />
    </main>

    <footer class="bg-white border-t border-slate-200 py-12 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 class="text-lg font-black text-slate-900 mb-6">Explora otras historias</h3>
        <div class="flex flex-wrap justify-center gap-4 mb-10">
          <NuxtLink to="/" class="px-6 py-2 bg-slate-100 text-slate-700 font-semibold rounded-full hover:bg-slate-200 transition-colors">Volver al Inicio</NuxtLink>
          <button class="px-6 py-2 bg-slate-100 text-slate-700 font-semibold rounded-full hover:bg-slate-200 transition-colors">Siguiente Personaje</button>
        </div>
        <div class="border-t border-slate-100 pt-8 text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
          <p class="mb-2 font-semibold">Información de Traducción</p>
          <p>Los versículos citados en esta plataforma han sido cuidadosamente seleccionados de la traducción Reina-Valera 1960 (RVR1960), manteniendo el equilibrio entre la fidelidad al texto original hebreo/arameo/griego y la belleza literaria.</p>
        </div>
      </div>
    </footer>
    
  </div>
</template>