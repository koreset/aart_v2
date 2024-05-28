import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/renderer/App.vue'
import AppLogin from '@/renderer/AppLogin.vue'
import AppSetup from '@/renderer/AppSetup.vue'
import router from '@/renderer/router'
import vuetify from '@/renderer/plugins/vuetify'
import i18n from '@/renderer/plugins/i18n'
import Vuelidate from 'vuelidate'
import { LicenseManager } from 'ag-grid-enterprise'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

LicenseManager.setLicenseKey(
  'DownloadDevTools_COM_NDEwMjM0NTgwMDAwMA==59158b5225400879a12a96634544f5b6'
)

// Add API key defined in contextBridge to window object type
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    mainApi?: any
  }
}

const activated = window.mainApi?.sendSync('msgGetAppStatus')

console.log('activated', activated)

let activeApp: any

if (activated) {
  const authenticatedUser = window.mainApi?.sendSync('msgGetAuthenticatedUser')
  if (authenticatedUser) {
    activeApp = App
  } else {
    activeApp = AppLogin
  }
} else {
  activeApp = AppSetup
}

const app = createApp(activeApp)

const comps = import.meta.glob('./components/**/*.vue')
for (const path in comps) {
  let name = upperFirst(camelCase(path.replace(/^\.\//, '').replace(/\.\w+$/, '')))
  name = name
    .replace(/Components/g, '')
    .replace(/^\.\//, '')
    .replace(/\.\w+$/, '')
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
    .replace(/^-/, '')
    .toLowerCase()
  app.component(name, comps[path])
}

app.use(vuetify).use(Vuelidate).use(i18n).use(router).use(createPinia())

app.mount('#app')
