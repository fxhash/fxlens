import {
  hexString,
  FxParamDefinition,
  FxParamProcessor,
  FxParamProcessors,
  FxParamTypeMap,
  FxParamType,
  FxParamsData,
} from "./types"

export function rgbaToHex(r: number, g: number, b: number, a: number) {
  return "#" + [r, g, b, (a * 255 + 0.5) | 0].map(U8).join("")
}

function completeHexColor(hexCode: hexString | string): string {
  let hex = hexCode.replace("#", "")
  const [r, g, b, a] = hex
  if (hex.length === 3) {
    hex = `${r}${r}${g}${g}${b}${b}ff`
  } else if (hex.length === 4) {
    hex = `${r}${r}${g}${g}${b}${b}${a}${a}`
  } else if (hex.length === 6) {
    hex = `${hex}ff`
  }
  return hex.padEnd(8, "0")
}

export function hexToRgba(hexCode: hexString) {
  const [r, g, b, $a] = [...asBytes(completeHexColor(hexCode), 4)]
  const a = Math.round(($a / 255 + Number.EPSILON) * 100) / 100
  return { r, g, b, a }
}

/**
 * Formats `x` as unsigned 8bit hex string.
 *
 * @param x
 */
function U8(x: number) {
  x >>>= 0
  return x < 10 ? "0" + x : x.toString(16)
}

/**
 * Formats `x` as unsigned 32bit hex string.
 *
 * @param x
 */
function U32(x: number) {
  return (x >>> 0).toString(16).padStart(8, "0")
}

/**
 * Formats `x` as unsigned 64bit hex string.
 *
 * @param x
 */
function U64(x: bigint) {
  return BigInt.asUintN(64, x).toString(16).padStart(16, "0")
}

/**
 * Takes a string of hex bytes and yields sequence of `n` parsed byte values.
 *
 * @param hex
 * @param n
 */
function* asBytes(hex: string, n: number) {
  n *= 2
  if (hex.length < n) throw new Error("input too short")
  for (let i = 0; i < n; i += 2) yield parseInt(hex.substring(i, i + 2), 16)
}

/**
 * Takes optional min/max values and their defaults. Returns new min/max
 * (clamped to interval defined by defaults).
 *
 * @param $min
 * @param $max
 * @param minDef
 * @param maxDef
 */
function minmax(
  $min?: number,
  $max?: number,
  minDef = Number.MIN_SAFE_INTEGER,
  maxDef = Number.MAX_SAFE_INTEGER
) {
  return {
    min: $min !== undefined ? Math.max(Number($min), minDef) : minDef,
    max: $max !== undefined ? Math.min(Number($max), maxDef) : maxDef,
  }
}

export const MIN_SAFE_INT64 = BigInt("-9223372036854775808")
export const MAX_SAFE_INT64 = BigInt("9223372036854775807")

export const ParameterProcessors: FxParamProcessors = {
  number: {
    serialize: (input) =>
      U64(new BigUint64Array(new Float64Array([input]).buffer)[0]),

    deserialize: (input) =>
      new Float64Array(new BigUint64Array([BigInt("0x" + input)]).buffer)[0],

    bytesLength: () => 8,

    random: ({ options }) => {
      const { min, max } = minmax(options?.min, options?.max)
      const v = Math.random() * (max - min) + min
      if (options?.step) {
        const t = 1.0 / options.step
        return Math.round(v * t) / t
      }
      return v
    },
  },

  bigint: {
    serialize: U64,

    deserialize: (input) => BigInt.asIntN(64, BigInt("0x" + input)),

    bytesLength: () => 8,

    random: ({ options }) => {
      let min = MIN_SAFE_INT64
      let max = MAX_SAFE_INT64
      if (options?.min !== undefined) {
        min = BigInt(options.min)
        if (min < MIN_SAFE_INT64) min = MIN_SAFE_INT64
      }
      if (options?.max !== undefined) {
        max = BigInt(options.max)
        if (max > MAX_SAFE_INT64) max = MAX_SAFE_INT64
      }
      const range = max - min
      const bits = range.toString(2).length
      let random
      do {
        random = BigInt(
          "0x" +
            Array.from(
              crypto.getRandomValues(new Uint8Array(Math.ceil(bits / 8)))
            )
              .map(U8)
              .join("")
        )
      } while (random > range)
      return random + min
    },
  },

  boolean: {
    serialize: (input) => (!!input ? "01" : "00"),

    deserialize: (input) => input !== "00",

    bytesLength: () => 1,

    random: () => Math.random() < 0.5,
  },

  color: {
    serialize: (input: string) => completeHexColor(input),

    deserialize: (input) => input,

    bytesLength: () => 4,

    transform: (input) => `#${completeHexColor(input)}`,

    random: () => U32(Math.random() * 0x100000000),
  },

  string: {
    /**
     * strings are encoded as UTF-8 and however JS uses UTF-16. Therefore the
     * {@link FxParamOption_string.maxLength} is to be understood as number of
     * bytes and WILL differ from `inputs.length` if the encoded string uses
     * multi-byte characters (emojis etc.).
     *
     * Using the native TextEncoder ensures all chars are encoded properly and
     * completely (unlike the earlier custom encoder used here)...
     */
    serialize: (input, def) => {
      const max = ParameterProcessors.string.bytesLength(def)
      const buf = new Uint8Array(max)
      new TextEncoder().encodeInto(input, buf)
      return Array.from(buf).map(U8).join("")
    },

    deserialize: (input, def) => {
      const max = ParameterProcessors.string.bytesLength(def)
      const buf = new Uint8Array(asBytes(input, max))
      const idx = buf.indexOf(0)
      // only decode until 1st ASCII 0 char (if any)
      return new TextDecoder().decode(idx !== -1 ? buf.subarray(0, idx) : buf)
    },

    // TODO impose limit on user provided maxLength
    bytesLength: (def) =>
      def.version
        ? def.options?.maxLength !== undefined
          ? Number(def.options.maxLength)
          : 64
        : 64,

    random: ({ options }) => {
      const { min, max } = minmax(options?.minLength, options?.maxLength, 0, 64)
      const length = Math.round(Math.random() * (max - min) + min)
      return [...Array(length)]
        .map(() => (~~(Math.random() * 36)).toString(36))
        .join("")
    },
  },

  select: {
    // clamp to [0..255] even if input isn't part of options
    serialize: (input, { options }) =>
      U8(Math.max(0, Math.min(255, options?.options.indexOf(input) || 0))),

    deserialize: (input, def) =>
      def.options?.options[parseInt(input, 16)] || def.default,

    bytesLength: () => 1, // index between 0 and 255

    random: (def) =>
      def.options?.options[~~(Math.random() * def.options.options.length)] ||
      def.default,
  },
}

/**
 * Serializes given `params` object to hex byte string, using provided param
 * `definitions`. Params are injected into the piece using the binary
 * representation of the numbers, to keep precision
 *
 * @param params
 * @param definitions
 */
export function serializeParams(
  params: any,
  definitions: FxParamDefinition<any>[]
) {
  // a single hex string will be used for all the params
  let bytes = ""
  if (!definitions) return bytes
  // loop through each parameter from the definition to find the associated
  // parameter as set on the UI
  for (const def of definitions) {
    const { id, type } = def
    const processor = ParameterProcessors[
      type as FxParamType
    ] as FxParamProcessor<any>
    // if the param is definined in the object

    const v = params[id] as FxParamTypeMap[]
    const val =
      v !== undefined
        ? v
        : def.default !== undefined
        ? def.default
        : processor.random(def)
    const serialized = processor.serialize(val, def)
    bytes += serialized
  }

  return bytes
}

/**
 * Takes a string of hex bytes and array of parameter definitions. Outputs an
 * array of deserialized parameters, mapping the raw bytes to their parameter
 * definitions and validating input based on the definition constraints
 *
 * @param bytes
 * @param definitions
 * @param options
 */
export function deserializeParams(
  bytes: string,
  definitions: FxParamDefinition<FxParamType>[],
  options: { withTransform?: boolean }
) {
  const params: Record<string, FxParamType> = {}
  for (const def of definitions) {
    const processor = ParameterProcessors[
      def.type as FxParamType
    ] as FxParamProcessor<FxParamType>
    // extract the length from the bytes & shift the initial bytes string
    const bytesLen = processor.bytesLength(def)
    // (times two because 1 hexbyte = 2 chars)
    const valueBytes = bytes.substring(0, bytesLen * 2)
    bytes = bytes.substring(bytesLen * 2)
    // deserialize the bytes into the params
    const val = processor.deserialize(valueBytes, def)
    params[def.id] =
      options?.withTransform && processor.transform
        ? processor.transform(val as FxParamType)
        : val
  }
  return params
}

/**
 * Consolidates parameters from both a params object provided by the token and
 * the dat object of params, which is stored by the controls component.
 *
 * @param params
 * @param data
 */
export function consolidateParams(params: any, data: any) {
  if (!params) return []

  const rtn = [...params]

  for (const p in rtn) {
    const definition = rtn[p]
    const { id, type, default: def } = definition
    if (data && data.hasOwnProperty(id)) {
      rtn[p].value = data[id]
    } else {
      const processor = ParameterProcessors[
        type as FxParamType
      ] as FxParamProcessor<any>
      let v
      if (def === undefined) v = processor.random(definition)
      else v = def
      rtn[p].value = processor.transform?.(v) || v
    }
  }

  return rtn
}

export function getRandomParamValues(
  params: FxParamDefinition<FxParamType>[],
  options?: { noTransform: boolean }
): any {
  return params.reduce((acc, definition) => {
    const processor = ParameterProcessors[
      definition.type as FxParamType
    ] as FxParamProcessor<FxParamType>
    const v = processor.random(definition) as FxParamType
    acc[definition.id] = options?.noTransform
      ? v
      : processor.transform?.(v) || v
    return acc
  }, {} as Record<string, any>)
}

export function sumBytesParams(
  definitions: FxParamDefinition<FxParamType>[]
): number {
  return (
    definitions?.reduce(
      (acc, def) =>
        acc +
        (
          ParameterProcessors[
            def.type as FxParamType
          ] as FxParamProcessor<FxParamType>
        ).bytesLength(def),
      0
    ) || 0
  )
}

export function stringifyParamsData(data: FxParamsData) {
  return JSON.stringify(data, (_, value) =>
    typeof value === "bigint" ? value.toString() : value
  )
}
