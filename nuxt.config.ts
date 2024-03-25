import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import path from 'path'
import fs from 'fs'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ['vuetify/lib/styles/main.sass','@mdi/font/css/materialdesignicons.min.css'],
  ssr: false,
  app: {
    head: {
      script: [
        {src: "https://www.google.com/recaptcha/api.js?render=explicit", defer: true, async: true},
        {src: "https://accounts.google.com/gsi/client", async:true},
        /*{src: "https://reports.vetmyidea.biz/core/report_builder.js", crossorigin:"anonymous"},*/
        {src: "https://www.googletagmanager.com/gtag/js?id=G-Z4T5SBW4ZS", async:true}
      ],
      /*link: [
        {href: "https://reports.vetmyidea.biz/core/report_builder.css", rel:"stylesheet", type:"text/css", crossorigin:"anonymous"}
      ],*/
      title: 'Vet My Idea'
    },
  },
  build: {
    transpile: ['vuetify'],
  },
  devServer: {
    https: {
      key: 'server.key',
      cert: 'server.crt'
    }
  },
  modules: [
    "floating-vue/nuxt",
    "nuxt-security",
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
  security: {
    nonce: true, // Enables HTML nonce support in SSR mode
    ssg: {
      meta: true, // Enables CSP as a meta tag in SSG mode
      hashScripts: true, // Enables CSP hash support for scripts in SSG mode
      hashStyles: false // Disables CSP hash support for styles in SSG mode (recommended)
    },
    headers: {
      contentSecurityPolicy: {
        'script-src': [
          "'self'",  // Fallback value, will be ignored by most modern browsers (level 3)
          "https:", // Fallback value, will be ignored by most modern browsers (level 3)
          "'unsafe-inline'", // Fallback value, will be ignored by almost any browser (level 2)
          "'strict-dynamic'", // Strict CSP via 'strict-dynamic', supported by most modern browsers (level 3)
          "'nonce-{{nonce}}'" // Enables CSP nonce support for scripts in SSR mode, supported by almost any browser (level 2)
        ],
        'style-src': [
          "'self'", // Enables loading of stylesheets hosted on same origin
          "https:", // For increased security, replace by the specific hosting domain or file name of your external stylesheets
          "'unsafe-inline'" // Recommended default for most Nuxt apps
        ],
        'img-src': ["'self'", "data:"], // Add relevant https://... sources if you load images from external sources 
        'font-src': ["'self'", "https:", "data:"], //  For increased security, replace by the specific sources for fonts
        'base-uri': ["'none'"],
        'object-src': ["'none'"],
        'script-src-attr': ["'none'"],
        'form-action': ["'self'"],
        'frame-ancestors': ["'self'"],
        'upgrade-insecure-requests': true
      },
      referrerPolicy: 'strict-origin-when-cross-origin',
      crossOriginOpenerPolicy: 'same-origin-allow-popups'
    },
    sri: true
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})