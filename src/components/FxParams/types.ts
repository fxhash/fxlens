export type FxParamType =
  | "number"
  | "boolean"
  | "color"
  | "string"
  | "select"
  | "integer"

interface FxParamOption_number {
  min?: string
  max?: string
  step?: string
}

interface FxParamOption_string {
  minLength?: string
  maxLength?: string
}

interface FxParamOption_select {
  options: string[]
}

export interface FxParamOptionsMap {
  number: FxParamOption_number
  boolean: undefined
  color: undefined
  string: FxParamOption_string
  select: FxParamOption_select
  integer: FxParamOption_number
}

export interface FxParamDefinition<Type extends FxParamType> {
  id: string
  name?: string
  type: Type
  default: string
  options?: FxParamOptionsMap[Type]
  exposedAsFeature?: string
}

export type hexString = `#${string}`

export interface FxParamTypeMap {
  number: number
  boolean: boolean
  color: hexString
  string: string
  select: string
  integer: bigint
}

export interface FxParamProcessor<Type extends FxParamType> {
  serialize: (
    input: FxParamTypeMap[Type],
    definition: FxParamDefinition<Type>
  ) => string
  deserialize: (
    input: string,
    definition: FxParamDefinition<Type>
  ) => FxParamTypeMap[Type]
  bytesLength: (options: FxParamOptionsMap[Type]) => number
  transform?: (input: string) => any
}

export type FxParamProcessors = {
  [T in FxParamType]: FxParamProcessor<T>
}
