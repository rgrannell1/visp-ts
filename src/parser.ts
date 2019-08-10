
import {
  ParseSource,
  ParseSuccess,
  ParseError,
  Parse,
  ParseResult
} from "./types"

import * as ast from "./ast"
import * as PC from "./pc"
import constants from "./constants";

export const comment = (input:ParseSource):ParseResult => {
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

  const expr = ast.comment(input.source.slice(0, newLineIdx + 1))
  const next = PC.input(input.source.slice(newLineIdx + 1), input.lineNumber + 1)

  return Parse.success(expr, next)
}

export const boolean = (input: ParseSource): ParseSuccess | ParseError => {
   const candidate = input.source.slice(0, 2)

   if (candidate === '#t' || candidate === '#f') {
    const expr = ast.boolean(input.source.slice(0, 2))
    const next = PC.input(input.source.slice(2), input.lineNumber)

    return Parse.success(expr, next)
    } else {
      return Parse.error({
        message: `I could not parse the boolean value, which should be either "#t" or "#f" but was "${candidate}"`
      })
  }
}

export const number = (input: ParseSource): ParseSuccess | ParseError => {
  const matches = constants.regexp.number.exec(input.source)

  // -- TODO: refactor to partial matches
  if (matches) {
    const match = matches[0]
    const expr = ast.boolean(input.source.slice(0, match.length))
    const next = PC.input(input.source.slice(match.length), input.lineNumber)

    return Parse.success(match, next)
  } else {
    return Parse.error({
      message: `I could not parse the number, as a number should match the regular expression "${constants.regexp.number}" but didn't\n\n` +
        `for example, some valid numbers are:` +
        ['0', '+1', '-1', '-10.5', '10.5', '+10.5'].join('\n')
    })
  }
}

export const string = (input: ParseSource): ParseSuccess | ParseError => {
  if (input.source[0] !== '"') {
    return Parse.error({
      message: `I could not parse the string, which should begin with " but was ${input.source[0]}`
    })
  }

  let included = 1
  while (input.source[included] !== '"') {
    if (included === input.source.length) {
      return Parse.error({
        message: `I could not parse the string, as the input ended before it reached a closing "`
      })
    }

    ++included
  }

  const expr = ast.string(input.source.slice(0, included + 1))
  const next = PC.input(input.source.slice(included + 1), input.lineNumber)

  return Parse.success(input.source.charAt(included + 1), next)
}

const spaceChars = new Set([' ', '  ', ',', '\n'])

export const whitespace = (input: ParseSource): ParseSuccess | ParseError => {
  let included = 0
  let lines = 0

  while (spaceChars.has(input.source.charAt(included)) && included < input.source.length) {
    included++

    if (input.source.charAt(included) === '\n') {
      lines++
    }
  }

  const expr = input.source.slice(included)
  const next = PC.input(expr, input.lineNumber + lines)

  return Parse.success(input.source.slice(0, included), next)
}

export const expression = (input: ParseSource): ParseResult => {
  const part = PC.oneOf([
    boolean,
    string,
    number,
    comment
  ])

  const term = PC.allOf([whitespace, part, whitespace])

  return PC.many1(term)(input)
}
