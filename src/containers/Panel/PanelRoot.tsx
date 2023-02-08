import style from "./PanelRoot.module.scss"
import cs from "classnames"
import { PanelHeader } from "./PanelHeader"
import { PanelParams } from "./PanelParams"
import { PanelFeatures } from "./PanelFeatures"
import { PanelControls } from "./PanelControls"
import { PanelHash } from "./PanelHash"

export function PanelRoot() {
  return (
    <div className={cs(style.root)}>
      <div className={cs(style.scrollWrapper)}>
        <PanelHeader />

        <div className={cs(style.body)}>
          <PanelHash />
          <PanelParams />
          <PanelFeatures />
        </div>
      </div>
      <PanelControls />
    </div>
  )
}
