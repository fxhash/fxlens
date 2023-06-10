import style from "./Frame.module.scss"
import cs from "classnames"
import { RefObject, useCallback, useRef } from "react"
import { useEffect } from "react"
import { useContext } from "react"
import { MainContext } from "context/MainContext"
import { FxParamsContext } from "components/FxParams/Context"
import { FxParamDefinition, FxParamType } from "components/FxParams/types"
import { usePostMessageListener } from "components/FxParams/hooks"
interface Props {
  url: string
  className?: string
}

export function Frame({ url, className }: Props) {
  const paramsContext = useContext(FxParamsContext)
  const ctx = useContext(MainContext)
  const ref = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (ref.current) ctx.setIframe(ref.current)
  }, [url, ref.current])

  usePostMessageListener(ref, "fxhash_getMinter", (e) => {
    if (e.data.data) {
      ctx.setMinter(e.data.data)
    } else {
      ctx.setMinter(null)
    }
  })

  usePostMessageListener(ref, "fxhash_getHash", (e) => {
    if (e.data.data) {
      ctx.setHash(e.data.data)
    } else {
      ctx.setHash(null)
    }
  })

  usePostMessageListener(ref, "fxhash_getFeatures", (e) => {
    if (e.data.data) {
      ctx.setFeatures(e.data.data)
    } else {
      ctx.setFeatures(null)
    }
  })

  usePostMessageListener(ref, "fxhash_getParams", (e) => {
    if (e.data.data) {
      const { definitions, values } = e.data.data
      if (definitions) {
        const definitionsWithDefaults = definitions.map(
          (d: FxParamDefinition<FxParamType>) => ({
            ...d,
            default: values?.[d.id],
          })
        )
        paramsContext.setDefinition(definitionsWithDefaults)
      }
    } else {
      paramsContext.setDefinition(null)
    }
  })

  usePostMessageListener(ref, "fxhash_getInfo", (e) => {
    const {
      version,
      params: { definitions, values },
      features,
      hash,
      minter,
    } = e.data.data
    if (definitions) {
      const definitionsWithDefaults = definitions.map(
        (d: FxParamDefinition<FxParamType>) => ({
          ...d,
          default: values?.[d.id],
        })
      )
      paramsContext.setDefinition(definitionsWithDefaults)
    }
    paramsContext.setVersion(version)
    ctx.setFeatures(features)
    ctx.setHash(hash)
    ctx.setMinter(minter)
  })

  return <iframe ref={ref} src={url} className={cs(style.root, className)} />
}
