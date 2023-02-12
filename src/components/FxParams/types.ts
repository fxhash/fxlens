export type FxParamType =
  | "number"
  | "bigint"
  | "boolean"
  | "color"
  | "string"
  | "select"

interface FxParamOption_bigint {
  min?: number
  max?: number
}

interface FxParamOption_number {
  min?: number
  max?: number
  step?: number
}

interface FxParamOption_string {
  minLength?: number
  maxLength?: number
}

interface FxParamOption_select {
  options: string[]
}

export interface FxParamOptionsMap {
  number: FxParamOption_number
  bigint: FxParamOption_bigint
  boolean: undefined
  color: undefined
  string: FxParamOption_string
  select: FxParamOption_select
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
  bigint: bigint
  boolean: boolean
  color: hexString
  string: string
  select: string
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
