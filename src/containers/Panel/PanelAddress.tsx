import styles from "./PanelAddress.module.scss"
import { useContext } from "react"
import { PanelGroup } from "components/Panel/PanelGroup"
import { BaseInput, IconButton } from "components/FxParams/BaseInput"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RuntimeContext } from "context/RuntimeContext"
import { mockBlockchainAddress } from "@fxhash/utils"
import { faEthereum } from "@fortawesome/free-brands-svg-icons"
import { IconTezos } from "components/Icon/Tezos"

export function PanelAddress() {
  const runtime = useContext(RuntimeContext)

  const handleChange = (e: any) => {
    runtime.state.update({ minter: e.target.value })
  }
  const handleRefresh = (address: string) => {
    runtime.state.update({ minter: address })
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
        <IconButton
          onClick={() => handleRefresh(mockBlockchainAddress("TEZOS"))}
          color="secondary"
        >
          <IconTezos />
        </IconButton>
        <IconButton
          onClick={() => handleRefresh(mockBlockchainAddress("ETHEREUM"))}
          color="secondary"
        >
          <FontAwesomeIcon icon={faEthereum} size="1x" />
        </IconButton>
      </div>
    </PanelGroup>
  )
}
