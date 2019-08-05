
import {
  ParseResult,
  ParseSource,
  Parse,
  Parser,
  isParseError,
  isParsePartial,
} from "./types";

const PC = {} as Record<string, Function>

PC.all = (parsers:Array<Parser>):Parser => {
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
    }
  }

  return data
}

export default PC
