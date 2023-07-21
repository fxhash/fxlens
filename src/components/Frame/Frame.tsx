import style from "./Frame.module.scss"
import cs from "classnames"
import { useRef } from "react"
import { useEffect } from "react"
import { useContext } from "react"
import { MainContext } from "context/MainContext"
import { FxParamDefinition, FxParamType } from "components/FxParams/types"
import { usePostMessageListener } from "components/FxParams/hooks"
import { RuntimeContext, RuntimeDefinition } from "context/RuntimeContext"

interface Props {
  url: string
  className?: string
}

export function Frame({ url, className }: Props) {
  const ctx = useContext(MainContext)
  const runtime = useContext(RuntimeContext)
  const ref = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (ref.current) ctx.setIframe(ref.current)
  }, [url, ref.current])

  usePostMessageListener(ref, "fxhash_getMinter", (e) => {
    runtime.state.update({
      minter: e.data.data || null,
    })
  })

  usePostMessageListener(ref, "fxhash_getHash", (e) => {
    runtime.state.update({
      hash: e.data.data || null,
    })
  })

  usePostMessageListener(ref, "fxhash_getFeatures", (e) => {
    ctx.setFeatures(e.data.data || null)
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
        runtime.definition.update({ params: definitionsWithDefaults })
      }
    } else {
      runtime.definition.update({ params: null })
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
    const defUpdate: Partial<RuntimeDefinition> = {}
    if (definitions) {
      const definitionsWithDefaults = definitions.map(
        (d: FxParamDefinition<FxParamType>) => ({
          ...d,
          default: values?.[d.id],
        })
      )
      defUpdate.params = definitionsWithDefaults
    }
    ctx.setFeatures(features)
    defUpdate.version = version
    runtime.definition.update(defUpdate)
    runtime.state.update({
      hash,
      minter,
    })
  })

  return (
    <iframe
      ref={ref}
      src={url}
      className={cs(style.root, className)}
      allow="accelerometer; camera; gyroscope; microphone; xr-spatial-tracking;"
    />
  )
}
