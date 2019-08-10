
import testing from '@rgrannell/testing';
import * as parser from '../src/parser'
import * as PC from '../src/pc'

const hypotheses = {} as Record<string, Object>

hypotheses.comment = testing.hypothesis('comments parse successfully')
  .cases(function* () {
    yield [
      PC.input('; comment\n', 1),
      {
        result: {data: {source: '; comment\n'}},
        rest: {source: '', lineNumber: 2}
      }
    ]
  })
  .always(input => {
    return input.hasOwnProperty('result')
  })
  .always(input => {
    const result = parser.comment(input)
    return false
  })

const theory = testing.theory({ description: 'Establish parsers work as expected' })
  .givenAll(hypotheses)

export default theory
