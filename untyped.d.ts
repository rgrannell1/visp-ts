
type condition = (...val:any) => Boolean

interface AlwaysReturn {
  always(condition: condition): AlwaysReturn
}

interface CasesReturn {
  always(condition:condition):AlwaysReturn
}

interface HypothesisReturn {
  cases(generator:() => IterableIterator<Array<any>>):CasesReturn
}

interface runArgs {
  report?: boolean
}

interface RunResult {
  results: Array<{
    results: Array<{
      failed ():any
    }>
  }>
}

interface GivenAllReturn {
  run(args:runArgs):Promise<RunResult>
}

interface TheoryReturn {
  givenAll(args:Object):GivenAllReturn
}

interface theoryArgs {
  description: string
}

declare module '@rgrannell/testing' {
  function hypothesis (source:string):HypothesisReturn
  function theory (args:theoryArgs):TheoryReturn
}
