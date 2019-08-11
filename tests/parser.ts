
import testing from '@rgrannell/testing'
import * as parser from '../src/parser'
import * as PC from '../src/pc'
import {
  ParseSource,
  ParseResult,
  isParseSuccess,
  Parser
} from '../src/types'

interface ExpectedParse {
  data: {
    source: string
  },
  rest: {
    source: string,
    lineNumber: number
  }
}

type ParseTest = [string, ExpectedParse]

const expectedParse = (data: string, rest: string, lineNumber: number): ExpectedParse => {
  return {
    data: { source: data },
    rest: { source: rest, lineNumber }
  }
}

const cases = {} as Record<string, Array<ParseTest>>

cases.comment = [
  [';\n', expectedParse(';\n', '', 2)],
  ['; comment\n', expectedParse('; comment\n', '', 2)],
  ['; comment\nmore text', expectedParse('; comment\n', 'more text', 2)],
]

cases.boolean = [
  ['#t', expectedParse('#t', '', 1)],
  ['#f', expectedParse('#f', '', 1)],
  ['#fmore text', expectedParse('#f', 'more text', 1)],
]

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

const hypotheses = {
  comment: testing.hypothesis('comments parse successfully')
    .cases(createCases(cases.comment, parser.comment))
    .always(expectations.hasSource)
    .always(expectations.hasRest)
    .always(expectations.hasLineNumber),
  boolean: testing.hypothesis('boolean parse successfully')
    .cases(createCases(cases.boolean, parser.boolean))
    .always(expectations.hasSource)
    .always(expectations.hasRest)
    .always(expectations.hasLineNumber),
}


export default testing.theory({ description: 'Establish parsers work as expected' })
  .givenAll(hypotheses)
