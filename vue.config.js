const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: '',
  
  transpileDependencies: [
    'quasar'
  ],

  devServer: {
    https: false,
  },

  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    },
    cordovaPath: 'src-cordova'
  }
})
