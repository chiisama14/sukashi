export default {
  install: (app) => {
    app.mixin({
      computed: {
        platform() {
          if (!window.device) {
            return 'Browser'
          } else {
            return window.device.platform
          }
        },
        isBrowser() {
          return window.isBrowser()
        },
        isSafari() {
          return this.platform === 'Browser' && /safari/i.test(window.navigator.userAgent) && !/chrome/i.test(window.navigator.userAgent)
        },
        isIPadBrowser() {
          return this.platform === 'Browser' && /Macintosh/i.test(window.navigator.userAgent) && window.navigator.maxTouchPoints && window.navigator.maxTouchPoints > 1
        },
        isIPhoneBrowser() {
          return this.platform === 'Browser' && /iPhone|iPad|iPod/.test(window.navigator.userAgent)
        },
        isAndroidBrowser() {
          return this.platform === 'Browser' && /android/i.test(window.navigator.userAgent)
        },
        isAndroidApp() {
          return window.isAndroidApp()
        },
        isIOSApp() {
          return window.isIOSApp()
        }
      }
    })
  }
}
  