import styles from "./PanelIteration.module.scss"
import { useContext } from "react"
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons"
import { PanelGroup } from "@/components/Panel/PanelGroup"
import { BaseInput, IconButton } from "@/components/FxParams/BaseInput"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RuntimeContext } from "@/context/RuntimeContext"

export function PanelIteration() {
  const runtime = useContext(RuntimeContext)

  const handleDecrease = () => {
    if (runtime.state.iteration === 1) return
    runtime.state.update({
      iteration: runtime.state.iteration - 1,
    })
  }

  const handleIncrease = () => {
    runtime.state.update({
      iteration: runtime.state.iteration + 1,
    })
  }

  const handleChangeIterationNumber = (e: any) => {
    const num = +e.target.value
    if (isNaN(num)) return
    runtime.state.update({
      iteration: num,
    })
  }

  return (
    <PanelGroup title="Iteration" description="The number of the iteration">
      <div className={styles.iterationControls}>
        <IconButton onClick={handleDecrease} color="secondary">
          <FontAwesomeIcon icon={faMinus} size="1x" />
        </IconButton>
        <BaseInput
          className={styles.numberInput}
          onChange={handleChangeIterationNumber}
          type="text"
          value={runtime.state.iteration}
        />
        <IconButton onClick={handleIncrease} color="secondary">
          <FontAwesomeIcon icon={faPlus} size="1x" />
        </IconButton>
      </div>
    </PanelGroup>
  )
}
