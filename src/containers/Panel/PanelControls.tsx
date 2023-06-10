import style from "./PanelControls.module.scss"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { IMainContext, MainContext } from "context/MainContext"
import { serializeParams, stringifyParamsData } from "components/FxParams/utils"
import { FxParamDefinition, FxParamType } from "components/FxParams/types"
import debounce from "lodash.debounce"
import { FxParamsContext } from "components/FxParams/Context"
import { BaseButton, BaseInput } from "components/FxParams/BaseInput"
import { createIframeUrl } from "utils/url"

type TUpdateIframe = (
  ctx: IMainContext,
  data?: Record<string, any>,
  params?: FxParamDefinition<any>[]
) => void

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
  definition: FxParamDefinition<FxParamType>[]
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
      const def = definition.find((d) => d.id === id)
      if (!def || !def.update || def.update === "page-reload") {
        return true
      }
    }
  }
  return false
}

const updateIframe: TUpdateIframe = (ctx, data, params) => {
  const url = createIframeUrl(ctx.baseUrl, {
    hash: ctx.hash,
    minter: ctx.minter,
    data,
    params,
  })
  const target = url.toString()
  if (ctx.iframe) {
    ctx.iframe.contentWindow?.location.replace(target)
  }
}

export function PanelControls() {
  const { data, params } = useContext(FxParamsContext)
  const ctx = useContext(MainContext)
  const [autoUpdate, setAutoUpdate] = useState(false)

  // the latest state which was pushed to iframe
  const currentState = useRef<ITokenState>()

  const updateIframeDebounced = useCallback<TUpdateIframe>(
    debounce<TUpdateIframe>((ctx, data, params) => {
      updateIframe(ctx, data, params)
    }, 200),
    []
  )

  useEffect(() => {
    const nextState = {
      hash: ctx.hash,
      minter: ctx.minter,
      params: { ...data },
    }
    if (
      autoUpdate &&
      currentState.current &&
      tokenStateChangeRequiresReload(currentState.current, nextState, params)
    ) {
      updateIframeDebounced(ctx, data, params)
    }
    currentState.current = nextState
  }, [ctx.hash, ctx.minter, stringifyParamsData(data)])

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
