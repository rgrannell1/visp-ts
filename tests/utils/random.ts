
export const choose = (opts:Array<string>) => {
  return opts[Math.floor(Math.random() * opts.length)]
}

export const integer = () => {
  let str = ''
  let magnitude = Math.floor(Math.random() * 10) + 1

  for (let ith = 0; ith < magnitude; ++ith) {
    str += Math.floor(Math.random() * 10)
  }

  return str
}

export const number = () => {
  let str = choose(['+', '-', ''])
  str += integer()

  if (Math.random() > 0.5) {
    str += `.${integer()}`
  }

  return str
}

export const repeat = function * (fn:() => string) {
  while (true) {
    yield fn()
  }
}
