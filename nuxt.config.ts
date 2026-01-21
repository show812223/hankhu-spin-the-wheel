// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    moduleOptions: {
      styles: true,
    },
    vuetifyOptions: './vuetify.config.ts',
  },
  app: {
    head: {
      title: 'Lucky Wheel - 幸運輪盤',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '輪盤抽獎遊戲 - 轉動輪盤決定幸運贏家！' },
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },
})
