
import {
  ParseResult,
  ParseSource,
  Parse,
  Parser,
  isParseError,
  isParsePartial,
  ParsePartial,
  isParseSuccess,
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

PC.oneOf = (parsers:Array<Parser>):Parser => {
  return (input: ParseSource): ParseResult => {
    let partial: ParsePartial | undefined

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

/*
    const acc = []
    let result = {isFailure: false, rest: input}

    let rest = input
    let wasMatched = false

    while (true) {
      result = parser(result.rest)

      if (result.isFailure) {
        break
      } else {
        acc.push(result.data)
        rest = result.rest
        wasMatched = true
      }
    }

    if (wasMatched) {
      return Parser.success(acc, rest)
    } else {
      return Parser.failure({
        message: `I could not parse the input once. Expected ${parser.meta().description}`,
      })
    }

*/

PC.many1 = (parser:Parser):Parser => {
  return (input: ParseSource): ParseResult => {
    const acc = []
    let rest = input
    let wasMatched = false

    while (true) {
      let result = parser(rest)

      if (isParseSuccess(result)) {
        acc.push(result.data)
        wasMatched = true
        rest = result.rest
        continue
      }

      break
     }

    if (wasMatched) {
      return Parse.success(acc, rest)
    } else {
      return Parse.error({
        message: 'I could not parse the input a single time.'
      })
    }
  }
}

PC.input = (source:string, lineNumber:number = 1):ParseSource => {
  return {
    source,
    lineNumber
  }
}

export default PC
