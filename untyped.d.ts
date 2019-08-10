
type condition = (val:any) => Boolean

interface CasesReturn {
  always(condition:condition):Object
}

interface HypothesisReturn {
  cases(generator:Function):CasesReturn
}

interface runArgs {
  report?: boolean
}

interface GivenAllReturn {
  run(args:runArgs):Promise<any>
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
