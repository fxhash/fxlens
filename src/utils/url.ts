import { FxParamDefinition, FxParamType } from "components/FxParams/types"
import { serializeParams } from "components/FxParams/utils"

export function encodeUrl(url: string) {
  return encodeURIComponent(url)
}

export function decodeUrl(url: string) {
  return decodeURIComponent(url)
}

export function createIframeUrl(
  baseUrl: string,
  options?: {
    hash?: string | null
    minter?: string | null
    data?: Record<string, FxParamType> | null
    params?: FxParamDefinition<FxParamType>[] | null
  }
) {
  const url = new URL(baseUrl)
  if (options?.hash) url.searchParams.append("fxhash", options.hash)
  if (options?.minter) url.searchParams.append("fxminter", options.minter)
  if (options?.data) {
    const bytes = serializeParams(options?.data, options?.params || [])
    url.searchParams.append("fxparams", `0x${bytes}`)
  }
  return url
}
