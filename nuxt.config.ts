import { devtools } from "vue";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  alias: {"@": "/<rootDir>"},

  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    '~/assets/scss/styles.scss',
  ],

  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/google-fonts'
  ],

  app: {
    head: {
      link: [ 
        {rel: 'icon', type: 'svg', href: '/logo.svg'},
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Gerenciador de Almoxarifado' },
      ]
    }
  },

  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700, 800],
      Montserrat: [400, 500, 600, 700, 800],
      Lora: [400, 500, 600, 700, 800],
      'Comic Neue': [400, 700],
    },
    display: 'swap',
    prefetch: true, 
    preconnect: true, 
    preload: true, 
    download: false, 
  },

  compatibilityDate: '2024-09-18'
})