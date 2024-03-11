// import this after install `@mdi/font` package
import { aliases,mdi } from 'vuetify/iconsets/mdi-svg'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


import '@/styles/main.scss'
import { createVuetify, type ThemeDefinition } from 'vuetify'

const light: ThemeDefinition = {
dark: false,
colors: {
    background: '#faf3de',
    surface: '#FFFFFF',
    primary: '#222222',
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
},
}

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: false,
    components,
    directives,
    theme: {
        defaultTheme: "light",
        themes: {
            light
        }
    },
    icons: {
        defaultSet: "mdi",
        aliases,
        sets: {
            mdi,
        },
    },
    defaults: {
        VBtn: {        
          variant: 'elevated',
          rounded: false,
        },
    },
  })
  app.vueApp.use(vuetify)
})