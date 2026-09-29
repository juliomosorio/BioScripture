// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000'
    }
  },
  app: {
    head: {
      titleTemplate: '%s · BioScripture',
      meta: [
        { name: 'description', content: 'Explora las historias, genealogías y rutas de los personajes bíblicos.' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,700;8..60,900&family=Inter:wght@400;500;600;700;800&display=swap' }
      ],
      script: [
        {
          // Aplica el tema guardado (o el del sistema) antes de pintar la página,
          // para que no se vea un parpadeo del tema equivocado al cargar.
          children: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()`,
          tagPosition: 'head'
        }
      ]
    }
  }
})
