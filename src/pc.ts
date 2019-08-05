
import {
  ParseResult,
  ParseSource,
  Parse,
  Parser,
  isParseError,
  isParsePartial,
} from "./types";

const PC = {} as Record<string, Function>

PC.allOf = (parsers:Array<Parser>):Parser => {
  return (input: ParseSource): ParseResult => {

    const acc = []
    let current = input

    for (const parser of parsers) {
      const result = parser(current)

      if (isParseError(result) || isParsePartial(result)) {
        return result
      }

      acc.push(result.data)
      current = result.rest
    }

    return Parse.success(acc, current)
  }
}

/*

for (const parser of parsers) {
  const result = parser(input)

  if (result.isFailure) {
    continue
  }

  if (result.isFailure === false && result.data === undefined) {
    throw new Error('undefined data returned from parser')
  }

  return result
}

return Parser.failure({
  message: `I could not parse the input with any of the supplied choice of parsers`
})


*/

PC.oneOf = (parsers:Array<Parser>):Parser => {
  return (input: ParseSource): ParseResult => {
    let partial

    for (const parser of parsers) {
      const result = parser(input)

      if (isParsePartial(result)) {
        partial = result
        continue
      } else if (isParseError(result)) {
        continue
      }

      return result
    }

    if (partial) {
      return partial
    } else {
      return Parse.error({
        message: `I could not parse the input with any of the supplied choice of parsers`
      })
    }
  }
}

PC.optional = (parser:Parser):Parser => {
  return (input:ParseSource):ParseResult => {
    const result = parser(input)

    return isParseError(result) || isParsePartial(result)
      ? Parse.success(null, input)
      : result
  }
}

PC.input = (source:string):ParseSource => {
  const data = {
    source,
    index: 0,
    lineNumber: 1,
    accept (to:number) {
      data.index += to
      data.lineNumber += (data.source.match(/\n/g) || []).length

      return data
    },
    peek (to:number) {
      return data.source.slice(0, to)
    }
  }

  return data
}

export default PC
