export const model = (manufacturerStr, modelStr) => {
  // "samsung" 問題に対応が必要

  if (modelStr.toLowerCase().startsWith(manufacturerStr.toLowerCase())) {
    // Canon Canon 60D
    return {
      manufacturer: manufacturerStr.charAt(0).toUpperCase() + manufacturerStr.substring(1),
      model: modelStr.replace(new RegExp('^' + manufacturerStr + '\\s?', 'i'), '')
    }
  } else {
    return {
      manufacturer: manufacturerStr.charAt(0).toUpperCase() + manufacturerStr.substring(1),
      model: modelStr
    }
  }
}

export const shutterSpeed = (exposureTime) => {
  if (Number.isInteger(exposureTime)) {
    return `${parseInt(exposureTime, 10)}s`
  } else if (Number.isInteger(1 / exposureTime)) {
    return `1/${1 / exposureTime}s`
  } else if (exposureTime < 0.001) {
    return `1/${parseInt(1 / exposureTime, 10)}s`
  } else {
    return `${exposureTime.toFixed(3)}s`
  }
}