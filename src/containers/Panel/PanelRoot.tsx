import style from "./PanelRoot.module.scss"
import cs from "classnames"
import { PanelHeader } from "./PanelHeader"
import { PanelParams } from "./PanelParams"
import { PanelFeatures } from "./PanelFeatures"
import { PanelControls } from "./PanelControls"
import { PanelHash } from "./PanelHash"

interface Props {
  
}
export function PanelRoot({
  
}: Props) {
  return (
    <div className={cs(style.root)}>
      <PanelHeader />

      <div className={cs(style.body)}>
        <PanelHash />
        <PanelParams />
        <PanelFeatures />
      </div>

      <PanelControls />
    </div>
  );
}