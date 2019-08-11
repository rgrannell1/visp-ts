
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

/**
 * Run a series of parsers, one after another, on input source. If any fails, bail out with an error or partial match.
 *
 * @param parsers An array of parsers to run sequentally against input source-code.
 */
export const allOf = (parsers:Array<Parser>):Parser => {
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

/**
 * Attempts to parse input with at least one parser. If all fail, it fails. May return a partial match.
 *
 * @param parsers An ordered array of parsers to run against the source in its entirety.
 */
export const oneOf = (parsers:Array<Parser>):Parser => {
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
        message: `I could not parse the input with any of the supplied choice of parsers`,
        lineNumber: input.lineNumber
      })
    }
  }
}

export const optional = (parser:Parser):Parser => {
  return (input:ParseSource):ParseResult => {
    const result = parser(input)

    return isParseError(result) || isParsePartial(result)
      ? Parse.success(null, input)
      : result
  }
}

/**
 * Attempt to parse input source repeatedly with a parser. Fails if it doesn't match at least once.
 *
 * @param parser the parser to match at least once, but potentially many times
 */
export const many1 = (parser:Parser):Parser => {
  return (input: ParseSource): ParseResult => {
    const acc = []
    let rest = input
    let wasMatched = false
    let result

    while (true) {
      result = parser(rest)

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
      if (isParseError((result))) {
        console.log("TCL: rest", rest)
        return Parse.error({
          lineNumber: rest.lineNumber,
          message: `I could not parse the input a single time. ${result.error.message}`
        })
      } else {
        console.log("TCL: rest", rest)

        return Parse.error({
          lineNumber: rest.lineNumber,
          message: `I could not parse the input a single time. The parser partially matched`
        })
      }
    }
  }
}

/**
 * Given raw source code construct a parseable object
 *
 * @param source the source code to use as a parse input elsewhere
 * @param lineNumber the starting line number of the source code
 */
export const input = (source:string, lineNumber:number = 1):ParseSource => {
  return {
    source,
    lineNumber
  }
}
