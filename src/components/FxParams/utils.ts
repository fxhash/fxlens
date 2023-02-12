import {
  hexString,
  FxParamDefinition,
  FxParamProcessor,
  FxParamProcessors,
  FxParamTypeMap,
  FxParamType,
} from "./types"

export function rgbaToHex(r: number, g: number, b: number, a: number): string {
  const outParts = [
    r.toString(16),
    g.toString(16),
    b.toString(16),
    Math.round(a * 255)
      .toString(16)
      .substring(0, 2),
  ]

  // Pad single-digit output values
  outParts.forEach(function (part, i) {
    if (part.length === 1) {
      outParts[i] = "0" + part
    }
  })

  return "#" + outParts.join("")
}

function completeHexColor(hexCode: hexString): string {
  let hex = hexCode.replace("#", "")
  if (hex.length === 6) {
    hex = `${hex}ff`
  }
  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}ff`
  }
  return hex
}

export function hexToRgba(hexCode: hexString) {
  const hex = completeHexColor(hexCode)

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const a =
    Math.round(
      (parseInt(hex.substring(6, 8), 16) / 255 + Number.EPSILON) * 100
    ) / 100

  return { r, g, b, a }
}

const stringToHex = function (s: string) {
  let rtn = ""
  for (let i = 0; i < s.length; i++) {
    rtn += s.charCodeAt(i).toString(16).padStart(4, "0")
  }
  return rtn
}
const hexToString = function (h: string) {
  const hx = h.match(/.{1,4}/g) || []
  let rtn = ""
  for (let i = 0; i < hx.length; i++) {
    const int = parseInt(hx[i], 16)
    if (int === 0) break
    rtn += String.fromCharCode(int)
  }
  return rtn
}

export const ParameterProcessors: FxParamProcessors = {
  number: {
    // get the hexadecimal bytes representation of the float64 number
    serialize: (input) => {
      const view = new DataView(new ArrayBuffer(8))
      view.setFloat64(0, input)
      return view.getBigUint64(0).toString(16).padStart(16, "0")
    },
    // this is for the snippet injected into fxhash pieces
    // convert hex from the string
    deserialize: (input) => {
      const view = new DataView(new ArrayBuffer(8))
      for (let i = 0; i < 8; i++) {
        view.setUint8(i, parseInt(input.substring(i * 2, i * 2 + 2), 16))
      }
      return view.getFloat64(0)
    },
    bytesLength: () => 8,
  },

  boolean: {
    // return 0 or 1 in hexadecimal - takes 1 byte instead of 1 bit but OK
    serialize: (input) => {
      return typeof input === "boolean"
        ? input
          ? "01"
          : "00"
        : typeof input === "string"
        ? input === "true"
          ? "01"
          : "00"
        : "00"
    },
    // if value is "00" -> 0 -> false, otherwise we consider it's 1
    deserialize: (input) => {
      return input === "00" ? false : true
    },
    bytesLength: () => 1,
  },

  color: {
    serialize: (input: hexString) => {
      // remove the '#' at the beginning and convert to a byte string
      return completeHexColor(input)
    },

    deserialize: (input): hexString => {
      return input as hexString
    },
    bytesLength: () => 4,
    transform: (input) => {
      return "#" + input
      const r = parseInt(input.slice(0, 2), 16)
      const g = parseInt(input.slice(2, 4), 16)
      const b = parseInt(input.slice(4, 6), 16)
      const a = parseInt(input.slice(6, 8), 16)
      return {
        hex: {
          rgb: "#" + input.slice(0, 6),
          rgba: "#" + input,
        },
        obj: {
          rgb: { r, g, b },
          rgba: { r, g, b, a },
        },
        arr: {
          rgb: [r, g, b],
          rgba: [r, g, b, a],
        },
      }
    },
  },

  string: {
    serialize: (input) => {
      let hex = stringToHex(input.substring(0, 64))
      hex = hex.padEnd(64 * 4, "0")
      return hex
    },

    deserialize: (input) => {
      return hexToString(input)
    },

    bytesLength: () => 64 * 2, // maximum string length of 64?
  },

  select: {
    serialize: (input, def) => {
      // find the index of the input in the array of options
      return Math.min(255, def.options?.options?.indexOf(input) || 0)
        .toString(16)
        .padStart(2, "0")
    },

    deserialize: (input, def) => {
      // get the index, which is the input
      const idx = parseInt(input, 16)
      return def.options?.options?.[idx] || def.options?.options?.[0] || ""
    },

    bytesLength: () => 1, // index between 0 and 255
  },
}

// params are injected into the piece using the binary representation of the
// numbers, to keep precision
export function serializeParams(
  params: any,
  definition: FxParamDefinition<any>[]
) {
  console.log({ params, definition })
  // a single hex string will be used for all the params
  let bytes = ""
  // loop through each parameter from the definition to find the associated
  // parameter as set on the UI
  for (const def of definition) {
    const { id, type } = def
    const processor = ParameterProcessors[
      type as FxParamType
    ] as FxParamProcessor<any>
    // if the param is definined in the object
    if (Object.hasOwn(params, id)) {
      const val = params[id] as FxParamTypeMap[]
      const serialized = processor.serialize(val, def)
      console.log({
        id,
        val,
        serialized,
      })
      bytes += serialized
    }
  }

  return bytes
}

// takes an array of bytes, in hexadecimal format, and a parametric space
// definition and outputs an array of parameters, mapping the definition and
// validating input based on the definition constraints
export function deserializeParams(
  bytes: string,
  definition: FxParamDefinition<any>[]
) {
  const params: Record<string, any> = {}
  for (const def of definition) {
    const processor = ParameterProcessors[
      def.type as FxParamType
    ] as FxParamProcessor<FxParamType>
    // extract the length from the bytes & shift the initial bytes string
    const bytesLen = processor.bytesLength(def.options)
    const valueBytes = bytes.substring(0, bytesLen * 2)
    bytes = bytes.substring(bytesLen * 2)
    // deserialize the bytes into the params
    params[def.id] = processor.deserialize(valueBytes, def)
  }
  return params
}

// Consolidates parameters from both a params object provided by the token
// and the dat object of params, which is stored by the controls component.
export function consolidateParams(params: any, data: any) {
  if (!params) return []

  const rtn = [...params]

  if (!data) return rtn

  for (const p in rtn) {
    const { id, type, default: def } = rtn[p]
    if (Object.hasOwn(data, id)) {
      rtn[p].value = data[id]
    } else {
      const processor = ParameterProcessors[
        type as FxParamType
      ] as FxParamProcessor<any>
      rtn[p].value = processor.transform?.(def) || def
    }
  }

  return rtn
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
        ).bytesLength(def?.options),
      0
    ) || 0
  )
}
