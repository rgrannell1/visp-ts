
import testing from '@rgrannell/testing'
import * as parser from '../src/parser'
import * as generators from './utils/generators'
import * as PC from '../src/pc'
import {
  ParseSource,
  ParseResult,
  isParseSuccess,
  Parser
} from '../src/types'
import {
  ParseTest,
  expectedParse,
  ExpectedParse
} from './utils/types'

const expectations = {
  hasSource: (res: ParseResult, expected: any) =>
    isParseSuccess(res) && res.data.source === expected.data.source,
  hasRest: (res: ParseResult, expected: any) =>
    isParseSuccess(res) && res.rest.source === expected.rest.source,
  hasLineNumber: (res: ParseResult, expected: any) =>
    isParseSuccess(res) && res.rest.lineNumber === expected.rest.lineNumber
}

const createCases = (cases: Array<ParseTest>, parser: Parser) => {
  return function* (): IterableIterator<any> {
    for (const [source, expected] of cases) {
      const result = parser(PC.input(source))
      yield [result, expected]
    }
  }
}

const RANGE = 100

const yieldCases = (iter: any) => function* (): IterableIterator<[ParseResult, ExpectedParse]> {
  let counter = 0

  for (const val of iter) {
    yield val
    ++counter

    if (counter > RANGE) {
      break
    }
  }
}

// -- use generators, product, and take to create test cases.

const hypotheses = {
  comment: testing.hypothesis('comments cases parse successfully')
    .cases(yieldCases(generators.comment()))
    .always(expectations.hasSource)
    .always(expectations.hasRest)
    .always(expectations.hasLineNumber),
  boolean: testing.hypothesis('boolean cases parse successfully')
    .cases(yieldCases(generators.boolean()))
    .always(expectations.hasSource)
    .always(expectations.hasRest)
    .always(expectations.hasLineNumber),
  number: testing.hypothesis('number cases parse successfully')
    .cases(yieldCases(generators.number()))
    .always(expectations.hasSource)
    .always(expectations.hasRest)
    .always(expectations.hasLineNumber)
}

export default testing.theory({ description: 'Establish parsers work as expected' })
  .givenAll(hypotheses)
