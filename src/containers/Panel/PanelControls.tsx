import style from "./PanelControls.module.scss"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { IMainContext, MainContext } from "context/MainContext"
import { serializeParams, stringifyParamsData } from "components/FxParams/utils"
import { FxParamDefinition, FxParamType } from "components/FxParams/types"
import debounce from "lodash.debounce"
import { BaseButton, BaseInput } from "components/FxParams/BaseInput"
import { createIframeUrl } from "utils/url"
import { IRuntimeContext, RuntimeContext } from "context/RuntimeContext"

type TUpdateIframe = (ctx: IMainContext, runtime: IRuntimeContext) => void

interface ITokenState {
  hash: string
  minter: string
  params: Record<string, any>
}

/**
 * Returns true if a change in a token state should result in a hard reload of
 * the context or not.
 * Mostly used to filter params in sync mode.
 */
function tokenStateChangeRequiresReload(
  prev: ITokenState,
  next: ITokenState,
  definition: FxParamDefinition<FxParamType>[] | null
): boolean {
  if (prev.hash !== next.hash) return true
  if (prev.minter !== next.minter) return true
  // find params which have changed
  for (const id in next.params) {
    if (
      !prev.params.hasOwnProperty(id) ||
      prev.params[id] !== next.params[id]
    ) {
      // check if an update is required
      const def = definition?.find((d) => d.id === id)
      if (!def || !def.update || def.update === "page-reload") {
        return true
      }
    }
  }
  return false
}

const updateIframe: TUpdateIframe = (ctx, runtime) => {
  const url = createIframeUrl(ctx.baseUrl, {
    hash: runtime.state.hash,
    minter: runtime.state.minter,
    data: runtime.state.params,
    params: runtime.definition.params,
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

  // the latest state which was pushed to iframe
  const currentState = useRef<ITokenState>()

  const updateIframeDebounced = useCallback<TUpdateIframe>(
    debounce<TUpdateIframe>((ctx, runtime) => {
      updateIframe(ctx, runtime)
    }, 200),
    []
  )

  useEffect(() => {
    const nextState = {
      hash: runtime.state.hash!,
      minter: runtime.state.minter!,
      params: { ...runtime.state.params },
    }
    if (
      autoUpdate &&
      currentState.current &&
      tokenStateChangeRequiresReload(
        currentState.current,
        nextState,
        runtime.definition.params
      )
    ) {
      updateIframeDebounced(ctx, runtime)
    }
    currentState.current = nextState
  }, [
    runtime.state.hash,
    runtime.state.minter,
    stringifyParamsData(runtime.state.params),
  ])

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
            const p = [`fxhash=${runtime.state.hash}`, `fxparams=0x${bytes}`]
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
