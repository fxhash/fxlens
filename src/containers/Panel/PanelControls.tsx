import style from "./PanelControls.module.scss"
import cs from "classnames"
import { useContext, useEffect, useState } from "react"
import { MainContext } from "context/MainContext"
import { serializeParams } from "utils/fxparams"
import {ParamsContext} from "context/Params"

const updateIframe = (ctx: any, data: any, params: any) => {
  const bytes = serializeParams(data, params);
  const p = [`fxhash=${ctx.hash}`, `fxparams=0x${bytes}`];
  const target = `${ctx.baseUrl}?${p.join("&")}`;
  if (ctx.iframe) {
    ctx.iframe.contentWindow?.location.replace(target);
  }
}

interface Props {
  
}
export function PanelControls({
  
}: Props) {
  const ctx = useContext(MainContext)
  const params = useContext(ParamsContext)

  const [autoUpdate, setAutoUpdate] = useState(false);
  const onAutoUpdate = () => {
    setAutoUpdate(!autoUpdate);
  }

  useEffect(() => {
      if (autoUpdate) {
        updateIframe(ctx, params.data, params.params);
      }
    },
    [ctx.hash, params.data]
  );


  return (
    <div className={style.controlPanel}>
      <input
        className={style.updateCheckbox}
        id="updateCheckbox"
        type="checkbox"
        checked={autoUpdate}
        onClick={onAutoUpdate}
      />
      <label htmlFor="updateCheckbox" className={style.checkbox}>
        auto-apply on settings update
      </label>
      <button
        type="button"
        onClick={() => {
          if (!params.params) return;
          const bytes = serializeParams(params.data, params.params);
          const p = [`fxhash=${ctx.hash}`, `fxparams=0x${bytes}`];
          const target = `${ctx.baseUrl}?${p.join("&")}`;
          window.open(target);
        }}
      >
        Open project in new tab
      </button>
      <button
        type="button"
        onClick={() => {
          console.log(ctx)
          console.log(params)
          updateIframe(ctx, params.data, params.params);
        }}
      >
        Refresh
      </button>
    </div>
  );
}
