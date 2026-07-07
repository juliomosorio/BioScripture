<template>
  <div class="relative flex flex-col md:flex-row items-start gap-6 md:gap-12 group cursor-pointer">
    
    <div class="relative z-10 flex-shrink-0">
      <div class="w-20 h-20 md:w-32 md:h-32 rounded-full border-4 border-[#F8FAFC] shadow-xl overflow-hidden ring-4 ring-indigo-50 group-hover:ring-indigo-200 transition-all duration-500 bg-white flex items-center justify-center">
        <img
          v-if="character.portrait_url"
          :src="character.portrait_url"
          :alt="character.name"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          @error="e => e.target.src = `https://ui-avatars.com/api/?name=${character.name}&background=eef2ff&color=4f46e5&size=256&bold=true`"
        />
      </div>
    </div>

    <div class="flex-1 w-full pt-2 md:pt-6">
      <NuxtLink :to="`/personaje/${character.id}`" class="block bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h3 class="text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{{ character.name }}</h3>
          <span class="inline-block bg-slate-100 text-slate-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider self-start sm:self-auto">
            {{ character.era }}
          </span>
        </div>

        <p v-if="character.story_sections && character.story_sections.length > 0" class="text-slate-500 leading-relaxed mb-6 text-base md:text-lg line-clamp-3">
          {{ character.story_sections[0].content }}
        </p>

        <div class="flex flex-wrap gap-2">
          <span v-for="role in character.roles" :key="role" class="bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
            {{ role }}
          </span>
        </div>
        
      </NuxtLink>
    </div>

  </div>
</template>

<script setup>
defineProps({
  character: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>