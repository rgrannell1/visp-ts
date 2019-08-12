
import docopt from 'docopt'
import parserTests from './index';

const doc = `
Usage:
  runner [--only-failures]
Description:
  Run visp's tests
`

const args = docopt.docopt(doc, {})

async function main () {
  if (args['--only-failure']) {
    const { results } = await parserTests.run({ })
    const tests = results[0]

    // -- retrieve failed and errored
    let testFailures:Array<any> = []

    tests.results.forEach((resultSet:any) => {
      testFailures = testFailures.concat(resultSet.failed())
    })

    console.log(testFailures)
  } else {
    await parserTests.run({ report: true })
  }
}

main()
