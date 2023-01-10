import style from "./PanelControls.module.scss"
import cs from "classnames"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { IMainContext, MainContext } from "context/MainContext"
import { serializeParams } from "utils/fxparams"
import { ParamsContext } from "context/Params"
import { ParameterValueMap } from "components/Params/tweakpane"
import { FxParamDefinition } from "types/fxparams"
import debounce from "lodash.debounce"

type TUpdateIframe = (
  ctx: IMainContext,
  data?: ParameterValueMap,
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
  const params = useContext(ParamsContext)

  const [autoUpdate, setAutoUpdate] = useState(false)

  const updateIframeDebounced = useCallback<TUpdateIframe>(
    debounce<TUpdateIframe>((ctx, data, params) => {
      updateIframe(ctx, data, params)
    }, 200),
    []
  )

  useEffect(() => {
    if (autoUpdate) {
      updateIframeDebounced(ctx, params.data!, params.params!)
    }
  }, [ctx.hash, JSON.stringify(params.data)])

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
          if (!params.params) return
          const bytes = serializeParams(params.data, params.params)
          const p = [`fxhash=${ctx.hash}`, `fxparams=0x${bytes}`]
          const target = `${ctx.baseUrl}?${p.join("&")}`
          window.open(target)
        }}
      >
        Open project in new tab
      </button>
      <button
        type="button"
        onClick={() => updateIframe(ctx, params.data, params.params)}
      >
        Refresh
      </button>
    </div>
  )
}
