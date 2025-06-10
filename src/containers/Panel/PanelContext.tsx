import styles from "./PanelContext.module.scss"
import { useContext } from "react"
import { PanelGroup } from "@/components/Panel/PanelGroup"
import { BaseSelect } from "@/components/FxParams/BaseInput"
import { RuntimeContext, TExecutionContext } from "@/context/RuntimeContext"

const contexts = ["minting", "standalone", "capture", "fast-capture"]

export function PanelContext() {
  const runtime = useContext(RuntimeContext)

  const handleChange = (context: TExecutionContext) => {
    runtime.state.update({ context })
  }

  return (
    <PanelGroup
      title="Execution context"
      description="Simulate different contexts in which the code will be executed."
    >
      <div className={styles.hashControls}>
        <BaseSelect
          name="context"
          className={styles.select}
          value={runtime.state.context}
          onChange={(evt) =>
            handleChange(evt.target.value as TExecutionContext)
          }
        >
          {contexts.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </BaseSelect>
      </div>
    </PanelGroup>
  )
}
