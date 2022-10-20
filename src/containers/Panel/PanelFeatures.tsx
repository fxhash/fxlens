import style from "./PanelFeatures.module.scss"
import cs from "classnames"
import { useContext } from "react"
import { MainContext } from "context/MainContext"
import { Features } from "components/Features"
import { PanelGroup } from "components/Panel/PanelGroup"

interface Props {
  
}
export function PanelFeatures({
  
}: Props) {
  const ctx = useContext(MainContext)

  return (
    <PanelGroup
      title="Features"
      description="Current features for this piece. Features are defined in your code and pulled in real time by this module."
    >
      <Features
        features={ctx.features}
      />
    </PanelGroup>
  );
}