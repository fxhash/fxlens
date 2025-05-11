import style from "./PanelRoot.module.scss"
import cs from "classnames"
import { PanelHeader } from "./PanelHeader"
import { PanelParams } from "./PanelParams"
import { PanelFeatures } from "./PanelFeatures"
import { PanelControls } from "./PanelControls"
import { PanelHash } from "./PanelHash"
import { PanelAddress } from "./PanelAddress"
import { PanelIteration } from "./PanelIteration"
import { PanelContext } from "./PanelContext"
import { BaseButton } from "@/components/FxParams/BaseInput"
import { MainContext } from "@/context/MainContext"
import { useContext } from "react"
import { PanelOpenForm } from "@/components/PanelOpenForm/PanelOpenForm"

export function PanelRoot() {
  const ctx = useContext(MainContext)
  return (
    <div className={cs(style.root)}>
      <div className={cs(style.scrollWrapper)}>
        <div className={style.tabs}>
          <BaseButton
            onClick={() => ctx.setMode("long")}
            className={style.tab}
            color={ctx.mode === "long" ? "primary" : "secondary"}
          >
            long form
          </BaseButton>
          <BaseButton
            onClick={() => ctx.setMode("open")}
            className={style.tab}
            color={ctx.mode === "open" ? "primary" : "secondary"}
          >
            open form
          </BaseButton>
        </div>
        <PanelHeader />
        <div className={cs(style.body)}>
          {ctx.mode === "long" &&
            <>          <PanelHash />
              <PanelAddress />
              <PanelContext />
              <PanelParams />
              <PanelIteration />
              <PanelFeatures /></>}
          {ctx.mode === "open" && <PanelOpenForm />}
        </div>
      </div>
      {ctx.mode === "long" && <PanelControls />}
    </div >
  )
}
