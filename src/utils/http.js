import axios from 'axios'

export default async (url, method, data, options = { }) => {
  if (window.device) {
    // cordova env
    window.cordova.plugin.http.setDataSerializer('json')
    window.cordova.plugin.http.setHeader('origin', 'https://milky.blue')

    const res = await promisify(window.cordova.plugin.http[method])(url, data, options)

    return JSON.parse(res.data)
  } else {
    const res = await axios[method](url, data)

    return res.data
  }
}

const promisify = func => {
  return function() { // <- function(){} の必要がある（arguments を使っているため）
    return new Promise((resolve, reject) => {
      func(...arguments, resolve, reject)
    })
  }
}
