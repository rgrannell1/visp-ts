
import docopt from 'docopt'
import parserTests from './index';

const doc = `
Usage:
  runner [--only-failures]
Description:
  Run visp's tests
`

const args = docopt.docopt(doc, {})

const opts = args['--only-failure'] === true
  ? { report: true }
  : {}


async function main () {
  const { results } = await parserTests.run(opts)
  const tests = results[0]

  // -- retrieve failed and errored
  let testFailures:Array<any> = []

  tests.results.forEach((resultSet:any) => {
    testFailures = testFailures.concat(resultSet.failed())
  })

  console.log(testFailures)
}

main()
