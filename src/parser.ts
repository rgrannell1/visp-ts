
import {
  ParseSource,
  ParseSuccess,
  ParseError,
  Parse
} from "./types"

import PC from "./pc"

const Parser = {} as Record<string, Function>

Parser.comment = (input:ParseSource):ParseSuccess|ParseError => {
  if (input.source[0] !== ';') {
    return Parse.error({
      message: `I could not parse the comment, the first character was "${input.source[0]}" but I expected ";"`
    })
  }

  const newLineIdx = input.source.indexOf('\n')

  if (newLineIdx === -1) {
    return Parse.partial({
      message: `I started parsing a comment, but never found a newline ending it`
    }, input)
  }

  return Parse.success(input.source.slice(0, newLineIdx), input.accept(newLineIdx))
}

 Parser.boolean = (input: ParseSource): ParseSuccess | ParseError => {
   const candidate = input.source.slice(0, 2)

   if (candidate === '#t' || candidate === '#f') {
     return Parse.success(input.source.slice(0, 2), input.accept(2))
    } else {
      return Parse.error({
        message: `I could not parse the boolean value, which should be either "#t" or "#f" but was "${candidate}"`
      })
  }
}
