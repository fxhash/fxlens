import { PropsWithChildren, useState } from "react"
import { useMemo } from "react"
import { useEffect } from "react"
import { createContext } from "react"
import { decodeUrl } from "utils/url"

/**
 * The Main Context will wait for the project URL to be available to render
 * its children elements, otherwise it will render a loader.
 * This ensures that children will have access to a valid context before getting
 * injected into the DOM.
 * For now the URL is directly derived from the URL parameters so the children
 * are injected into the DOM at the first render call.
 */

export interface IMainContext {
  // the base project URL
  baseUrl: string
  // the url currently loaded in the iframe
  url: string
  setUrl: (url: string) => void
  // params pulled from the <iframe> element
  params: any
  setParams: (params: any) => void
  // params pulled the controls
  data: any
  setData: (params: any) => void
  // params update - used for auto refreshing
  datParamsUpdate: any
  setDatParamsUpdate: (params: any) => void
  // features from the <iframe> element
  features: any
  setFeatures: (features: any) => void
  // hash from the <iframe> element
  hash: any
  setHash: (hash: string) => void
  iframe: HTMLIFrameElement | null
  setIframe: (iframe: HTMLIFrameElement) => void
}

const defaultMainContext: IMainContext = {
  baseUrl: "",
  url: "",
  setUrl: () => {},
  params: [],
  setParams: () => {},
  data: null,
  setData: () => {},
  datParamsUpdate: null,
  setDatParamsUpdate: () => {},
  features: null,
  setFeatures: () => {},
  hash: null,
  setHash: () => {},
  iframe: null,
  setIframe: () => {},
}

export const MainContext = createContext(defaultMainContext)

type Props = PropsWithChildren<{}>
export function MainProvider({ children }: Props) {
  const [baseUrl, _] = useState(
    decodeUrl(new URLSearchParams(window.location.search).get("target") || "")
  )
  // initialize the URL from the query parameter target
  const [url, setUrl] = useState(baseUrl)

  // params, features, and hash, will be pulled out of the iframe
  const [params, setParams] = useState<any>(null)
  const [features, setFeatures] = useState<any>(null)
  const [hash, setHash] = useState<any>(null)

  const [data, setData] = useState<any>(null)
  const [datParamsUpdate, setDatParamsUpdate] = useState<any>(null)

  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null)

  const context: IMainContext = {
    baseUrl,
    url,
    setUrl,
    params,
    setParams,
    data,
    setData,
    datParamsUpdate,
    setDatParamsUpdate,
    features,
    setFeatures,
    hash,
    setHash,
    iframe,
    setIframe,
  }

  return <MainContext.Provider value={context}>{children}</MainContext.Provider>
}
