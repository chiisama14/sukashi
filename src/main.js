import { createApp } from 'vue'
import device from './plugins/device'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'

import locales from './locales'

window.deepCopy = obj => JSON.parse(JSON.stringify(obj))

const i18n = createI18n({
  locale: window.localStorage['locale'] || window.navigator.language.split('-')[0],
  fallbackLocale: 'en',
  messages: locales
})

createApp(App)
  .use(i18n)
  .use(Quasar, quasarUserOptions)
  .use(device)
  .mount('#app')

document.addEventListener('deviceready', () => {
  // cordova
  if (window.isAndroid()) {
    document.querySelectorAll('a').forEach(el => {
      if (!((el.getAttribute('href') || '').startsWith('http'))) {
        return
      }

      el.addEventListener('click', e => {
        window.navigator.app.loadUrl(el.getAttribute('href'), { openExternal: true })
        e.preventDefault()
      })
    })
  }

  // for iOS, need another handling
  // https://stackoverflow.com/questions/17887348/phonegap-open-link-in-browser
}, false)
window.isBrowser = () => {
  return !window.device
}

window.isAndroid = () => {
  if (!window.device) {
    return false
  }

  return window.device.platform === 'Android'
}
