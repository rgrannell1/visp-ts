
import testing from '@rgrannell/testing';
import * as parser from '../src/parser'

const hypotheses = {} as Record<string, Object>

hypotheses.comment = testing.hypothesis('fp.id returns the supplied value')
  .cases(function* () {
    yield [ '; comment' ]
  })
  .always((case:Array<string>) => {
    return false
  })

const theory = testing.theory({ description: 'Establish parsers work as expected' })
  .givenAll(hypotheses)

let x = theory.run({ report: true }).catch((err:Error) => {
  throw err
})
x

export default theory
