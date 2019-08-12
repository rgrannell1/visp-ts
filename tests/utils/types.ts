
export interface ExpectedParse {
  data: {
    source: string
  },
  rest: {
    source: string,
    lineNumber: number
  }
}

export type ParseTest = [string, ExpectedParse]

export const expectedParse = (data: string, rest: string, lineNumber: number): ExpectedParse => {
  return {
    data: { source: data },
    rest: { source: rest, lineNumber }
  }
}
