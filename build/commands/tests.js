
const execa = require('execa')

const command = {
  name: 'test',
  dependencies: ['build']
}

command.cli = `
Usage:
  script test

Description:
  Run visp's tests
`

command.task = async args => {
  require('../../dist/tests/runner')
}

module.exports = command
