import { Controls } from "components/FxParams/Controls"
import { PanelGroup } from "components/Panel/PanelGroup"
import { useContext } from "react"
import { FxParamsContext } from "components/FxParams/Context"
import { ProgressBar } from "components/ProgressBar/ProgressBar"

export function PanelParams() {
  const ctx = useContext(FxParamsContext)

  return (
    <PanelGroup
      title="Params"
      description="fx(params) can be defines in your code and are pulled in real time from the code running. Parameter value space is limited to 50kb."
    >
      <ProgressBar max={50000} progress={ctx.byteSize || 0} />
      <Controls params={ctx.params} />
    </PanelGroup>
  )
}
