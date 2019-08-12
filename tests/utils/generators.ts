
import {
  ParseTest,
  expectedParse,
  ExpectedParse
} from "./types"

import * as random from './random'

import * as parser from "../../src/parser";
import * as PC from '../../src/pc'
import { ParseSuccess, ParseResult } from "../../src/types";

/**
 * Yield random junk the parsers should ignore
 */
const rest = function* (): IterableIterator<string> {
  yield ''
  yield 'more text'
}

type GeneratorResult = IterableIterator<[ParseResult, ExpectedParse]>

/**
 * Yield random booleans as test-cases
 */
export const boolean = function* (): GeneratorResult {
  const cases = ['#t', '#f']

  for (const text of rest()) {
    for (const tcase of cases) {
      const full = `${tcase}${text}`
      yield [
        parser.boolean(PC.input(full)),
        expectedParse(tcase, text, 1)
      ]
    }
  }
}

/**
 * Yield random comments as test-cases
 */
export const comment = function* (): GeneratorResult {
  const cases = [';\n', ';\n']

  for (const text of rest()) {
    for (const tcase of cases) {
      const full = `${tcase}${text}`
      yield [
        parser.comment(PC.input(full)),
        expectedParse(tcase, text, 2)
      ]
    }
  }
}

/**
 * Yield random numbers as test-cases
 */
export const number = function * (): GeneratorResult {
  for (const text of rest()) {
    for (const tcase of random.repeat(random.number)) {
      const full = `${tcase}${text}`
      yield [
        parser.number(PC.input(full)),
        expectedParse(tcase, text, 1)
      ]
    }
  }
}
