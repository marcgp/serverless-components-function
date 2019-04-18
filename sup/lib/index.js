/**
* SUP Lib
*/

/**
* Run
* @description Parses and runs a SUP
*/

const run = (sup) => {

  // Parse sup string
  if (typeof sup === 'string') sup = parseSupString(sup)

  // See if sup exists
  let supFn
  try {
    supFn = require(`../sups/${sup.sup}`)
  } catch(error) {
    throw new Error(`SUP ${sup.sup} is not yet supported or mispelled.`)
  }

  // Translate to vendor syntax
  return supFn(sup)
}

/**
* Parse SUP String
* @description Helper function to parse a SUP statement
*/

const parseSupString = (supString) => {

  const supObject = {
    sup: null,
    options: {}
  }

  // If statement does not include a '?', its global access to a service
  if (!supString.includes('?')) {
    supObject.sup = supString
  } else {
    supObject.sup = supString.split('?')[0]
    supObject.options = parseSupStringOptions(supString.split('?')[1])
  }

  return supObject
}

/**
* Parse SUP Options
* @description Helper function to parse options in a SUP options string
*/

const parseSupStringOptions = (o) => {

  const options = {}

  let opts = o.split('+')

  opts.forEach((opt) => {

    // If no '=', set to true
    if (!opt.includes('=')) {
      options[opt] = true
      return
    }

    // If '=', its another option
    let key = opt.split('=')[0]
    let val = opt.split('=')[1]
    options[key] = (val.split(',')).length > 1 ? val.split(',') : val.split(',')
    return
  })

  return options
}


module.exports = {
  run,
}
