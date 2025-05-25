import { OpenFormContext } from "@/context/OpenFormContext"
import { useContext } from "react"
import { BaseButton } from "../FxParams/BaseInput"
import style from "./PanelOpenForm.module.scss"
import { PanelGroup } from "../Panel/PanelGroup"
import { Item } from "./Item"
import { PreviewSize } from './Controller/PreviewSize'
import { CaptureTriggerControl } from './Controller/CaptureTrigger'
import { CaptureTargetControl } from './Controller/CaptureTarget'

export function PanelOpenForm() {
  const { addNode, tree } = useContext(OpenFormContext)

  return (
    <div className={style.panel}>
      <PanelGroup
        title="Settings"
        description="Adjust preview and capture options"
        isExpandable={true}
        expanded={false}
      >
        <PreviewSize />
        <CaptureTriggerControl />
        <CaptureTargetControl />
      </PanelGroup>
      <PanelGroup
        title="create root iteration"
        description="create a new open root iteration"
      >
        <BaseButton onClick={() => addNode()}>new root iteration</BaseButton>
      </PanelGroup>
      <PanelGroup title="">
        {tree.map((node) => (
          <div className={style.root}>
            <Item node={node} depth={0} />
          </div>
        ))}
      </PanelGroup>
    </div>
  )
}
