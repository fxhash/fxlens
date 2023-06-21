import { FxParamDefinition, FxParamType } from "components/FxParams/types"
import { serializeParams } from "components/FxParams/utils"
import { TExecutionContext } from "context/RuntimeContext"

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
    iteration?: number
    context?: TExecutionContext
  }
) {
  const url = new URL(baseUrl)
  if (options?.hash) url.searchParams.append("fxhash", options.hash)
  if (options?.minter) url.searchParams.append("fxminter", options.minter)
  if (options?.iteration)
    url.searchParams.append("fxiteration", `${options.iteration}`)
  if (options?.data) {
    const bytes = serializeParams(options?.data, options?.params || [])
    url.searchParams.append("fxparams", `0x${bytes}`)
  }
  url.searchParams.append("fxcontext", options?.context || "standalone")
  return url
}
