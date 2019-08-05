
export interface ParseSource {
  source: string,
  index: number,
  lineNumber: number,
  accept(to: number): ParseSource
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

export const Parse = {} as Record<string, Function>

Parse.success = (data: any, rest: ParseSource): ParseSuccess => {
  return {
    data,
    rest,
    isSuccess: true
  }
}

Parse.partial = (data: any, rest:ParseSource): ParsePartial => {
  return {
    data,
    rest,
    isPartial: true
  }
}

Parse.error = (error: any): ParseError => {
  return {
    error,
    isError: true
  }
}

export const ast = {} as Record<string, Function>

export type ParseResult = ParseError | ParsePartial | ParseSuccess
export type Parser = (input: ParseSource) => ParseResult

export function isParseError(value: ParseResult): value is ParseError {
  return (value as any).isError === true
}

export function isParseSuccess(value: ParseResult): value is ParseSuccess {
  return (value as any).isPartial === true
}

export function isParsePartial(value: ParseResult): value is ParsePartial {
  return (value as any).isPartial === true
}
