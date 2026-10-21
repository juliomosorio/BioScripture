<template>
  <div class="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
    <TransitionGroup name="toast">
      <div v-for="t in toasts" :key="t.id" class="pointer-events-auto flex items-center gap-3 bg-ink-fixed text-white rounded-2xl shadow-xl px-4 py-3 max-w-xs">
        <div class="w-9 h-9 rounded-full bg-gold-400 text-ink-fixed flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3h14v4a7 7 0 01-14 0V3zM9 21h6M12 14v7M5 5H3v2a3 3 0 003 3M19 5h2v2a3 3 0 01-3 3"></path></svg>
        </div>
        <div>
          <p class="text-[10px] font-bold uppercase tracking-wider text-gold-300">{{ t.title }}</p>
          <p class="text-sm font-semibold">{{ t.body }}</p>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
const { toasts } = useToast()
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(20px); }
</style>
