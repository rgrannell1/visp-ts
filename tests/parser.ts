
import testing from '@rgrannell/testing'
import * as parser from '../src/parser'
import * as PC from '../src/pc'
import {
  ParseSource, ParseResult
} from '../src/types'

interface ExpectedParse {

}

const cases:Array<[string, ExpectedParse]> = [
  ['; comment\n', {

  }]
]

const hypotheses = {} as Record<string, Object>

hypotheses.comment = testing.hypothesis('comments parse successfully')
  .cases(function* (): IterableIterator<any> {
    for (const [source, expected] of cases) {
      const result = parser.comment(PC.input(source))
      yield [ result, expected ]
    }
  })
  .always((result:ParseResult, expected:any) => {
    return true
  })

const theory = testing.theory({ description: 'Establish parsers work as expected' })
  .givenAll(hypotheses)

export default theory
