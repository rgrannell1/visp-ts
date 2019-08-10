
export interface ParseSource {
  readonly source: string,
  readonly lineNumber: number,
}

export interface ParseSuccess {
  readonly isSuccess: true,
  readonly rest: ParseSource,
  readonly data: any
}

export interface ParseError {
  readonly isError: true,
  readonly error: {
    message: string
  }
}

export interface ParsePartial {
  readonly isPartial: true,
  readonly data: any,
  readonly rest: ParseSource
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
