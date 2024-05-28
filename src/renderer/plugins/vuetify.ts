import { createVuetify } from 'vuetify'
import { ko, en, zhHans, zhHant, de, es, ja, fr, ru, pt } from 'vuetify/locale'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.min.css'

import colors from 'vuetify/lib/util/colors.mjs'

export default createVuetify({
  locale: {
    messages: { ko, en, zhHans, zhHant, de, es, ja, fr, ru, pt },
    locale: 'en',
    fallback: 'en'
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#003F58',
          background: '#2e566e',
          secondary: '#2D5BB2',
          tertiary: '#5F82C5',
          accent: '#223F54',
          navbar: '#2E566E'
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: colors.grey.darken4
        }
      }
    }
  }
})
