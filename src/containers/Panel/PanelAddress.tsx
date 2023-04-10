import styles from "./PanelAddress.module.scss"
import { useContext } from "react"
import { MainContext } from "context/MainContext"
import { faRotate } from "@fortawesome/free-solid-svg-icons"
import { PanelGroup } from "components/Panel/PanelGroup"
import { BaseInput, IconButton } from "components/FxParams/BaseInput"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

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
  const ctx = useContext(MainContext)

  const handleChange = (e: any) => {
    ctx.setMinter(e.target.value)
  }
  const handleRefresh = () => {
    ctx.setMinter(getNewAddress())
  }

  return (
    <PanelGroup
      title="Minter address"
      description="The address of the user who will mint an iteration."
    >
      <div className={styles.hashControls}>
        <BaseInput
          type="text"
          value={ctx.minter}
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
