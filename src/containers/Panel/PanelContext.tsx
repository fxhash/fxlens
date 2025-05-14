import styles from "./PanelContext.module.scss"
import { useContext } from "react"
import { MainContext } from "@/context/MainContext"
import { faRotate } from "@fortawesome/free-solid-svg-icons"
import { PanelGroup } from "@/components/Panel/PanelGroup"
import {
  BaseInput,
  BaseSelect,
  IconButton,
} from "@/components/FxParams/BaseInput"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RuntimeContext, TExecutionContext } from "@/context/RuntimeContext"

const contexts = ["minting", "standalone", "capture"]

export function PanelContext() {
  const ctx = useContext(MainContext)
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
