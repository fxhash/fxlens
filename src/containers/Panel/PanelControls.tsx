import style from "./PanelControls.module.scss"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { IMainContext, MainContext } from "context/MainContext"
import { serializeParams, strinigfyParams } from "components/FxParams/utils"
import { FxParamDefinition } from "components/FxParams/types"
import debounce from "lodash.debounce"
import { FxParamsContext } from "components/FxParams/Context"
import { BaseButton, BaseInput } from "components/FxParams/BaseInput"

type TUpdateIframe = (
  ctx: IMainContext,
  data?: Record<string, any>,
  params?: FxParamDefinition<any>[]
) => void

const updateIframe: TUpdateIframe = (ctx, data, params) => {
  const bytes = serializeParams(data, params || [])
  const url = new URL(ctx.baseUrl)
  url.searchParams.append("fxhash", ctx.hash)
  url.searchParams.append("fxparams", `0x${bytes}`)
  const target = url.toString()
  console.log(target)
  if (ctx.iframe) {
    ctx.iframe.contentWindow?.location.replace(target)
  }
}

export function PanelControls() {
  const { data, params } = useContext(FxParamsContext)
  const ctx = useContext(MainContext)
  const [autoUpdate, setAutoUpdate] = useState(false)

  const updateIframeDebounced = useCallback<TUpdateIframe>(
    debounce<TUpdateIframe>((ctx, data, params) => {
      updateIframe(ctx, data, params)
    }, 200),
    []
  )

  useEffect(() => {
    if (autoUpdate) {
      updateIframeDebounced(ctx, data, params)
    }
  }, [ctx.hash, strinigfyParams(data)])

  return (
    <div className={style.controlPanel}>
      <div className={style.checkboxWrapper}>
        <BaseInput
          id="updateCheckbox"
          type="checkbox"
          checked={autoUpdate}
          onChange={() => setAutoUpdate(!autoUpdate)}
        />
        <label htmlFor="updateCheckbox">auto-apply on settings update</label>
      </div>
      <div className={style.buttonsWrapper}>
        <BaseButton
          onClick={() => {
            if (!params) return
            const bytes = serializeParams(data, params)
            const p = [`fxhash=${ctx.hash}`, `fxparams=0x${bytes}`]
            const target = `${ctx.baseUrl}?${p.join("&")}`
            window.open(target)
          }}
        >
          new tab
        </BaseButton>
        <BaseButton onClick={() => updateIframe(ctx, data, params)}>
          Refresh
        </BaseButton>
      </div>
    </div>
  )
}
