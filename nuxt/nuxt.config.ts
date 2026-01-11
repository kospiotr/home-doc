// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'nuxt-svg-sprite-icon',
    'nuxt-auth-utils',
    'pinia-plugin-persistedstate/nuxt',
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/api/**': {
      cors: true
    }
  },

  compatibilityDate: '2024-07-11',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  piniaPluginPersistedstate: {
    storage: 'localStorage',
    debug: true,
  },
  runtimeConfig: {
    oauth: {
      github: {
        scope: ['read:user', 'user:email', 'repo']
      }
    }
  }
})