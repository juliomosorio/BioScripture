<template>
  <div class="relative flex flex-col md:flex-row items-start gap-6 md:gap-12 group cursor-pointer">

    <div class="relative z-10 flex-shrink-0">
      <div class="w-20 h-20 md:w-32 md:h-32 rounded-full border-4 border-parchment shadow-xl overflow-hidden ring-4 ring-brand-50 group-hover:ring-gold-200 transition-all duration-500 bg-brand-50 flex items-center justify-center">
        <img
          v-if="character.portrait_url"
          :src="character.portrait_url"
          :alt="character.name"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div v-else class="w-1/2 h-1/2 text-brand-600 group-hover:scale-110 transition-transform duration-700">
          <CharacterIcon :roles="character.roles" />
        </div>
      </div>
      <ClientOnly>
        <div v-if="isRead(character.id)" title="Ya leíste esta historia" class="absolute -bottom-1 -right-1 w-6 h-6 md:w-7 md:h-7 rounded-full bg-brand-600 border-2 border-parchment flex items-center justify-center text-white shadow-sm">
          <svg class="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
      </ClientOnly>
    </div>

    <div class="flex-1 w-full pt-2 md:pt-6">
      <NuxtLink :to="`/personaje/${character.id}`" class="block bg-surface rounded-3xl p-6 md:p-8 shadow-sm border border-line hover:shadow-2xl hover:shadow-brand-100/50 hover:-translate-y-1 hover:border-gold-200 transition-all duration-300">

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h3 class="font-serif text-3xl font-black text-ink group-hover:text-brand-600 transition-colors">{{ character.name }}</h3>
          <span class="inline-block bg-parchment-soft text-ink-soft text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider self-start sm:self-auto">
            {{ character.era }}
          </span>
        </div>

        <p v-if="character.story_sections && character.story_sections.length > 0" class="text-ink-soft leading-relaxed mb-6 text-base md:text-lg line-clamp-3">
          {{ character.story_sections[0].content }}
        </p>

        <div class="flex flex-wrap gap-2">
          <span v-for="role in character.roles" :key="role" class="bg-brand-50 border border-brand-100 text-brand-700 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
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

const { isRead } = useReadProgress()
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
