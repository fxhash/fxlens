import style from "./PanelControls.module.scss"
import { useCallback, useContext, useEffect, useState } from "react"
import { IMainContext, MainContext } from "context/MainContext"
import { serializeParams } from "components/FxParams/utils"
import debounce from "lodash.debounce"
import { BaseButton, BaseInput } from "components/FxParams/BaseInput"
import { createIframeUrl } from "utils/url"
import { IRuntimeContext, RuntimeContext } from "context/RuntimeContext"

type TUpdateIframe = (ctx: IMainContext, runtime: IRuntimeContext) => void

const updateIframe: TUpdateIframe = (ctx, runtime) => {
  const url = createIframeUrl(ctx.baseUrl, {
    hash: runtime.state.hash,
    minter: runtime.state.minter,
    data: runtime.state.params,
    params: runtime.definition.params,
    iteration: runtime.state.iteration,
    context: runtime.state.context,
  })
  const target = url.toString()
  if (ctx.iframe) {
    ctx.iframe.contentWindow?.location.replace(target)
  }
}

export function PanelControls() {
  const ctx = useContext(MainContext)
  const runtime = useContext(RuntimeContext)
  const [autoUpdate, setAutoUpdate] = useState(false)

  const updateIframeDebounced = useCallback<TUpdateIframe>(
    debounce<TUpdateIframe>((ctx, runtime) => {
      updateIframe(ctx, runtime)
    }, 200),
    []
  )

  // if auto-update, refresh when hard state changes
  useEffect(() => {
    if (autoUpdate) {
      updateIframeDebounced(ctx, runtime)
    }
  }, [runtime.details.stateHash.hard])

  return (
    <div className={style.controlPanel}>
      <div className={style.checkboxWrapper}>
        <>
          <BaseInput
            id="updateCheckbox"
            type="checkbox"
            checked={autoUpdate}
            onChange={() => setAutoUpdate(!autoUpdate)}
          />
          <label htmlFor="updateCheckbox">auto-apply on settings update</label>
        </>
      </div>
      <div className={style.buttonsWrapper}>
        <BaseButton
          onClick={() => {
            if (!runtime.state.params) return
            const bytes = serializeParams(
              runtime.state.params,
              runtime.definition.params!
            )
            const p = [
              `fxhash=${runtime.state.hash}`,
              `fxparams=0x${bytes}`,
              `fxminter=${runtime.state.minter}`,
            ]
            const target = `${ctx.baseUrl}?${p.join("&")}`
            window.open(target)
          }}
        >
          new tab
        </BaseButton>
        <BaseButton onClick={() => updateIframe(ctx, runtime)}>
          Refresh
        </BaseButton>
      </div>
    </div>
  )
}
