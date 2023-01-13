import style from "./Frame.module.scss"
import cs from "classnames"
import { useRef } from "react"
import { useEffect } from "react"
import { useContext } from "react"
import { MainContext } from "context/MainContext"

interface Props {
  url: string
  className?: string
}
export function Frame({
  url,
  className,
}: Props) {
  const ctx = useContext(MainContext)
  const ref = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (ref.current) {
      // update the iframe ref in the context
      ctx.setIframe(ref.current)
      
      // when iframe triggers load event, pulls params & features
      ref.current.onload = () => {
        // the iframe is loaded, we can inspect its dom and extract needed data
        // @ts-ignore
        const $fx = ref.current?.contentWindow.$fx

        if ($fx?.hash) {
          ctx.setHash($fx.hash);
        }

        if ($fx?._params) {
          ctx.setParams($fx._params)
        }

        if ($fx?._features) {
          ctx.setFeatures($fx._features)
        }
      }
    }
  }, [])

  return (
    <iframe 
      ref={ref}
      src={url}
      className={cs(style.root, className)}
    />
  )
}
