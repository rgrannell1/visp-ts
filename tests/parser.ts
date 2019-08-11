
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

const cases:Array<[string, ExpectedParse]> = [
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

const hypotheses = {} as Record<string, Object>

hypotheses.comment = testing.hypothesis('comments parse successfully')
  .cases(function* (): IterableIterator<any> {
    for (const [source, expected] of cases) {
      const result = parser.comment(PC.input(source))
      yield [ result, expected ]
    }
  })
  .always(expectations.hasSource)
  .always(expectations.hasRest)
  .always(expectations.hasLineNumber)

const theory = testing.theory({ description: 'Establish parsers work as expected' })
  .givenAll(hypotheses)

export default theory
