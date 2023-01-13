import style from "./PanelControls.module.scss"
import cs from "classnames"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { IMainContext, MainContext } from "context/MainContext"
import { serializeParams } from "components/FxParams/utils"
import { FxParamDefinition } from "components/FxParams/types"
import debounce from "lodash.debounce"

type TUpdateIframe = (
  ctx: IMainContext,
  data?: Record<string, any>,
  params?: FxParamDefinition<any>[]
) => void

const updateIframe: TUpdateIframe = (ctx, data, params) => {
  const bytes = serializeParams(data, params || [])
  const p = [`fxhash=${ctx.hash}`, `fxparams=0x${bytes}`]
  const target = `${ctx.baseUrl}?${p.join("&")}`
  if (ctx.iframe) {
    ctx.iframe.contentWindow?.location.replace(target)
  }
}

interface Props {}
export function PanelControls({}: Props) {
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
      updateIframeDebounced(ctx, ctx.data, ctx.params)
    }
  }, [ctx.hash, JSON.stringify(ctx.data)])

  return (
    <div className={style.controlPanel}>
      <input
        className={style.updateCheckbox}
        id="updateCheckbox"
        type="checkbox"
        checked={autoUpdate}
        onClick={() => setAutoUpdate(!autoUpdate)}
      />
      <label htmlFor="updateCheckbox" className={style.checkbox}>
        auto-apply on settings update
      </label>
      <button
        type="button"
        onClick={() => {
          if (!ctx.params) return
          const bytes = serializeParams(ctx.data, ctx.params)
          const p = [`fxhash=${ctx.hash}`, `fxparams=0x${bytes}`]
          const target = `${ctx.baseUrl}?${p.join("&")}`
          window.open(target)
        }}
      >
        Open project in new tab
      </button>
      <button
        type="button"
        onClick={() => updateIframe(ctx, ctx.data, ctx.params)}
      >
        Refresh
      </button>
    </div>
  )
}
