import style from "./PanelControls.module.scss"
import cs from "classnames"
import { useContext, useEffect, useState } from "react"
import { MainContext } from "context/MainContext"
import { serializeParams } from "utils/fxparams"

const updateIframe = (ctx: any) => {
  const bytes = serializeParams(ctx.datParams, ctx.params);
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

  const [autoUpdate, setAutoUpdate] = useState(false);
  const onAutoUpdate = () => {
    setAutoUpdate(!autoUpdate);
  }

  useEffect(() => {
      if (autoUpdate) {
        updateIframe(ctx);
      }
    },
    [ctx.hash, ctx.datParamsUpdate]
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
          const bytes = serializeParams(ctx.datParams, ctx.params);
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
          updateIframe(ctx);
        }}
      >
        Refresh
      </button>
    </div>
  );
}