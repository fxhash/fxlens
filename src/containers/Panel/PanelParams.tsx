import { Controls } from "components/FxParams/Controls"
import { PanelGroup } from "components/Panel/PanelGroup"
import { useContext } from "react"
import { FxParamsContext } from "components/FxParams/Context"

export function PanelParams() {
  const ctx = useContext(FxParamsContext)

  return (
    <PanelGroup
      title="Params"
      description="fx(params) can be defines in your code and are pulled in real time from the code running."
    >
      <Controls params={ctx.params} />
    </PanelGroup>
  )
}
