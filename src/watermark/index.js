const context = require.context('.', true, /\.js$/)

const obj = {}

context.keys().forEach(key => {
  if (key.indexOf('./index.js') === 0) {
    return
  }

  const k = key.replace(/\.\//, '').replace('.js', '')

  obj[k] = context(key).default
})

export default obj
