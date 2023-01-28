import style from "./Frame.module.scss"
import cs from "classnames"
import { useCallback, useRef } from "react"
import { useEffect } from "react"
import { useContext } from "react"
import { MainContext } from "context/MainContext"
import {FxParamsContext} from "components/FxParams/Context"

interface Props {
  url: string
  className?: string
}
export function Frame({
  url,
  className,
}: Props) {
  const paramsContext = useContext(FxParamsContext)
  const ctx = useContext(MainContext)
  const ref = useRef<HTMLIFrameElement>(null)
  
  useEffect(() => {
    const listener = (e: any) => {
      if (e.data) {
        console.log(e.data)
        if (e.data.id === "fxhash_getHash") {
          if (e.data.data) {
            ctx.setHash(e.data.data)
          } else {
            ctx.setHash(null)
          }
        }
        if (e.data.id === "fxhash_getFeatures") {
          if (e.data.data) {
            ctx.setFeatures(e.data.data)
          } else {
            ctx.setFeatures(null)
          }
        }
        if (e.data.id === "fxhash_getParams") {
          if (e.data.data) {
            paramsContext.setParams(e.data.data)
          } else {
            paramsContext.setParams(null)
          }
        }
      }
    }
    
    window.addEventListener("message", listener, false)

    return () => {
      window.removeEventListener("message", listener, false)
    }
  }, [])

  const handleOnIframeLoad = useCallback(() => {
    if (ref.current) {
      ctx.setIframe(ref.current)
      ref.current.contentWindow?.postMessage("fxhash_getFeatures", "*")
      ref.current.contentWindow?.postMessage("fxhash_getParams", "*")
      ref.current.contentWindow?.postMessage("fxhash_getHash", "*")
    }
  }, [ref.current])

  return (
    <iframe 
      ref={ref}
      src={url}
      onLoad={handleOnIframeLoad}
      className={cs(style.root, className)}
    />
  )
}
