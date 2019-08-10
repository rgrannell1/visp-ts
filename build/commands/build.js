
const execa = require('execa')

const command = {
  name: 'build',
  dependencies: []
}

command.cli = `
Usage:
  script build

Description:
  build typescript
`

command.task = async args => {
  const { stdout } = await execa('node_modules/.bin/tsc')
  console.log(stdout)
}

module.exports = command
