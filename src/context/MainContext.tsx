import { PropsWithChildren, useMemo, useState } from "react"
import { createContext } from "react"
import { appendUrlParameters, decodeUrl } from "@/utils/url"
import { TExecutionContext } from "./RuntimeContext"

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
  // features from the <iframe> element
  features: any
  setFeatures: (features: any) => void
  iframe: HTMLIFrameElement | null
  setIframe: (iframe: HTMLIFrameElement) => void
  mode: "long" | "open"
  setMode: (mode: "long" | "open") => void
  baseHash: string | null
  rootUrl: string
}

const defaultMainContext: IMainContext = {
  baseUrl: "",
  url: "",
  setUrl: () => {},
  features: null,
  setFeatures: () => {},
  iframe: null,
  setIframe: () => {},
  mode: "long",
  setMode: () => {},
  baseHash: null,
  rootUrl: "",
}

export const MainContext = createContext(defaultMainContext)

type Props = PropsWithChildren<any>
export function MainProvider({ children }: Props) {
  const [mode, setMode] = useState<"long" | "open">("long")
  const baseUrl = decodeUrl(
    new URLSearchParams(window.location.search).get("target") || ""
  )
  const initialContext = new URLSearchParams(window.location.search).get(
    "fxcontext"
  ) as TExecutionContext

  const parsed = useMemo(() => new URL(baseUrl), [baseUrl])

  const baseHash = useMemo(() => {
    return parsed.searchParams.get("fxhash") || null
  }, [parsed])

  // initialize the URL from the query parameter target
  const [url, setUrl] = useState(
    appendUrlParameters(parsed.origin + parsed.pathname, {
      fxcontext: initialContext,
      fxhash: baseHash,
    })
  )

  const [features, setFeatures] = useState<any>(null)

  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null)

  const context: IMainContext = {
    mode,
    setMode,
    baseUrl,
    url,
    setUrl,
    features,
    setFeatures,
    iframe,
    setIframe,
    baseHash,
    rootUrl: parsed.origin + parsed.pathname,
  }

  return <MainContext.Provider value={context}>{children}</MainContext.Provider>
}
