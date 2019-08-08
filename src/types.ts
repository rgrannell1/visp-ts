
export interface ParseSource {
  source: string,
  lineNumber: number,
}

export interface ParseSuccess {
  isSuccess: true,
  rest: ParseSource,
  data: any
}

export interface ParseError {
  isError: true,
  error: {
    message: string
  }
}

export interface ParsePartial {
  isPartial: true,
  data: any,
  rest: ParseSource
}

export const Parse = {
  success (data: any, rest: ParseSource): ParseSuccess {
    return {
      data,
      rest,
      isSuccess: true
    }
  },
  partial (data: any, rest:ParseSource): ParsePartial {
    return {
      data,
      rest,
      isPartial: true
    }
  },
  error (error: any): ParseError {
    return {
      error,
      isError: true
    }
  }
}


export const ast = {} as Record<string, Function>

export type ParseResult = ParseError | ParsePartial | ParseSuccess
export type Parser = (input: ParseSource) => ParseResult

export function isParseError(value: ParseResult): value is ParseError {
  return (value as any).isError === true
}

export function isParseSuccess(value: ParseResult): value is ParseSuccess {
  return (value as any).isSuccess === true
}

export function isParsePartial(value: ParseResult): value is ParsePartial {
  return (value as any).isPartial === true
}
