
import parser from './parser'
import testing from '@rgrannell/testing';

export default testing.theory({ description: 'Visp works as expected' })
  .givenAll({
    parser
  })
