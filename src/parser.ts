
import {
  ParseSource,
  ParseSuccess,
  ParseError,
  Parse
} from "./types"

import PC from "./pc"
import constants from "./constants";

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

Parser.number = (input: ParseSource): ParseSuccess | ParseError => {
  const matches = constants.regexp.number.exec(input.source)

  // -- TODO: refactor to partial matches
  if (matches) {
    const match = matches[0]
    return Parse.success(match, input.accept(match.length))
  } else {
    return Parse.error({
      message: `I could not parse the number, as a number should match the regular expression "${constants.regexp.number}" but didn't\n\n` +
        `for example, some valid numbers are:` +
        ['0', '+1', '-1', '-10.5', '10.5', '+10.5'].join('\n')
    })
  }
}

Parser.string = (input: ParseSource): ParseSuccess | ParseError => {
  if (input.peek(1) !== '"') {
    return Parse.error({
      message: `I could not parse the string, which should begin with " but was ${input.peek(1)}`
    })
  }

  let included = 1
  while (input.peek(included) !== '"') {
    if (included === input.source.length) {
      return Parse.error({
        message: `I could not parse the string, as the input ended before it reached a closing "`
      })
    }

    ++included
  }

  return Parse.success(input.peek(included + 1), input.accept(included + 1))
}

const spaceChars = new Set([' ', '  ', ',', '\n'])

Parser.whitespace = (input: ParseSource): ParseSuccess | ParseError => {
  let included = 0

  while (spaceChars.has(input.source.charAt(included)) && included < input.source.length - 1) {
    included++
  }

  return Parse.success(input.peek(included), input.accept(included))
}

const input = PC.input('')
const x = Parser.whitespace(input)
x
