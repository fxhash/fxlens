import styles from "./PanelAddress.module.scss"
import { useContext } from "react"
import { faRotate } from "@fortawesome/free-solid-svg-icons"
import { PanelGroup } from "components/Panel/PanelGroup"
import { BaseInput, IconButton } from "components/FxParams/BaseInput"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RuntimeContext } from "context/RuntimeContext"

const getNewAddress = () => {
  const alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
  return (
    "tz1" +
    Array(33)
      .fill(0)
      .map((_) => alphabet[(Math.random() * alphabet.length) | 0])
      .join("")
  )
}

export function PanelAddress() {
  const runtime = useContext(RuntimeContext)

  const handleChange = (e: any) => {
    runtime.state.update({ minter: e.target.value })
  }
  const handleRefresh = () => {
    runtime.state.update({ minter: getNewAddress() })
  }

  return (
    <PanelGroup
      title="Minter address"
      description="The address of the user who will mint an iteration."
    >
      <div className={styles.hashControls}>
        <BaseInput
          type="text"
          value={runtime.state.minter}
          onChange={handleChange}
          className={styles.hashInput}
        />
        <IconButton onClick={handleRefresh} color="secondary">
          <FontAwesomeIcon icon={faRotate} size="1x" />
        </IconButton>
      </div>
    </PanelGroup>
  )
}
