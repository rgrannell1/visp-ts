import {
  ParseTest,
  expectedParse,
  ExpectedParse
} from "./types"

import * as parser from "../../src/parser";
import * as PC from '../../src/pc'
import { ParseSuccess, ParseResult } from "../../src/types";

export const take = function* <T> (range:number, iter:IterableIterator<T>) {
  for (let ith = 0; ith < range; ++ith) [
    yield iter.next()
  ]
}

const rest = function* (): IterableIterator<string> {
  yield ''
  yield 'more text'
}

type GeneratorResult = IterableIterator<[ParseResult, ExpectedParse]>

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

export const comment = function* (): GeneratorResult {
  const cases = [';\n', ';comment\n']

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
