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

const handleSharedImage = () => {
  // share with
  window.cordova.openwith.init()

  window.cordova.openwith.addHandler(intent => {
    if (intent.items.length === 1) {
      window.cordova.openwith.load(intent.items[0], data => {
        window.dispatchEvent(new CustomEvent('intent', {
          detail: {
            data,
            type: intent.items[0].type
          }
        }))

        if (intent.exit) {
          window.cordova.openwith.exit()
        }
      }, )
    } else {
      if (intent.exit) {
        window.cordova.openwith.exit()
      }
    }
  })
}

// cordova
document.addEventListener('deviceready', async () => {
  // modify link behavior
  if (window.isAndroidApp()) {
    document.querySelectorAll('a').forEach(el => {
      if (!((el.getAttribute('href') || '').startsWith('http'))) {
        return
      }

      el.addEventListener('click', e => {
        window.navigator.app.loadUrl(el.getAttribute('href'), { openExternal: true })
        e.preventDefault()
      })
    })

    handleSharedImage()
  } else {
    // TODO: for iOS, need another handling
    // https://stackoverflow.com/questions/17887348/phonegap-open-link-in-browser
  }

  window.versionNumber = await window.cordova.getAppVersion.getVersionNumber()
}, false)

// cordova
document.addEventListener('resume', () => {
  handleSharedImage()
})

window.isBrowser = () => {
  return !window.device
}

window.isAndroidApp = () => {
  if (!window.device) {
    return false
  }

  return window.device.platform === 'Android'
}

window.isIOSApp = () => {
  if (!window.device) {
    return false
  }

  return window.device.platform === 'iOS'
}
