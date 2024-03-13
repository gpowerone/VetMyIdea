import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ['vuetify/lib/styles/main.sass','@mdi/font/css/materialdesignicons.min.css'],
  ssr: false,
  app: {
    head: {
      script: [
        {src: "https://www.google.com/recaptcha/api.js?render=explicit", defer: true, async: true},
        {src: "https://accounts.google.com/gsi/client", async:true},
        /*{src: "https://www.googletagmanager.com/gtag/js?id=G-Z4T5SBW4ZS", async:true}*/
      ],
      title: 'Vet My Idea'
    },
  },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    }
  ],
  runtimeConfig: {
    public: {
       googleClient: "",
       envUrl: "",
       oauthClient: "",
       oauthRedirect: "",
       oauthScopes: "",
       oauthUri: "",
       recaptchaSitekey: ""
    },

    awsClient: "",
    awsSecret: "",
    googleSecret: "",
    oauthSecret: "",
    oauthToken: "",
    oauthUserinfo: "",
    recaptchaSecret: ""
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})