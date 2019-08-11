
import testing from '@rgrannell/testing'
import * as parser from '../src/parser'
import * as PC from '../src/pc'
import {
  ParseSource, ParseResult, isParseSuccess
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

const cases = {} as Record<string, Array<ParseTest>>

cases.comment = [
  ['; comment\n', {
    data: { source: '; comment\n' },
    rest: { source: '', lineNumber: 2 }
  }]
]

const expectations = {
  hasSource: (res: ParseResult, expected: any) =>
    isParseSuccess(res) && res.data.source === expected.data.source,
  hasRest: (res: ParseResult, expected: any) =>
    isParseSuccess(res) && res.rest.source === expected.rest.source,
  hasLineNumber: (res: ParseResult, expected: any) =>
    isParseSuccess(res) && res.rest.lineNumber === expected.rest.lineNumber
}

const createCases = (cases:Array<ParseTest>) => {
  return function* (): IterableIterator<any> {
    for (const [source, expected] of cases) {
      const result = parser.comment(PC.input(source))
      yield [result, expected]
    }
  }
}

const hypotheses = {} as Record<string, Object>

hypotheses.comment = testing.hypothesis('comments parse successfully')
  .cases(createCases(cases.comment))
  .always(expectations.hasSource)
  .always(expectations.hasRest)
  .always(expectations.hasLineNumber)

const theory = testing.theory({ description: 'Establish parsers work as expected' })
  .givenAll(hypotheses)

export default theory
