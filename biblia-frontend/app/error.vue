<template>
  <div class="min-h-screen flex items-center justify-center bg-parchment px-4 font-sans text-ink">
    <div class="text-center max-w-md">
      <div class="flex justify-center mb-6">
        <BrandLogo :size="56" :with-wordmark="false" />
      </div>
      <h1 class="font-serif text-6xl font-black text-ink mb-4">{{ error?.statusCode || 500 }}</h1>
      <h2 class="text-xl font-bold text-ink-soft mb-3">
        {{ error?.statusCode === 404 ? 'Página no encontrada' : 'Algo salió mal' }}
      </h2>
      <p class="text-ink-faint mb-8">
        {{ error?.statusCode === 404
          ? 'El personaje o la página que buscas no existe en el registro histórico.'
          : 'Ocurrió un error inesperado al cargar esta página.' }}
      </p>
      <button @click="handleError" class="px-6 py-2.5 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-700 transition-colors">
        Volver al Inicio
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>
