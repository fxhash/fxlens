import { Controls } from "components/FxParams/Controls"
import { PanelGroup } from "components/Panel/PanelGroup"
import { useContext } from "react"
import { FxParamsContext } from "components/FxParams/Context"
import { ProgressBar } from "components/ProgressBar/ProgressBar"

const MAX_BYTES = 50000

export function PanelParams() {
  const ctx = useContext(FxParamsContext)
  const bytes = ctx.byteSize || 0
  const byteAttention = bytes >= MAX_BYTES / 2
  return (
    <PanelGroup
      title="Params"
      description={`fx(params) can be defines in your code and are pulled in real time from the code running. ${
        byteAttention ? `Parameter value space is limited to 50kb.` : ""
      }`}
    >
      {byteAttention && <ProgressBar max={MAX_BYTES} progress={bytes} />}
      <Controls params={ctx.params} />
    </PanelGroup>
  )
}
