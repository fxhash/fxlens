import {
  faExternalLink,
  faRemove,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons"
import { BaseButton, BaseInput, IconButton } from "../FxParams/BaseInput"
import { NestedOpenFormNode, RawOpenFormNode } from "../OpenFormFrame/_types"
import style from "./Item.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { OpenFormContext } from "@/context/OpenFormContext"
import { useContext } from "react"
import classNames from "classnames"
import { useOpenFormGraph } from "@fxhash/open-form-graph"
import { mockEthereumTransactionHash } from "@fxhash/utils"
import { createIframeUrl } from "@/utils/url"
import { MainContext } from "@/context/MainContext"
import { searchParents } from "../OpenFormFrame/util"

interface ItemProps {
  node: NestedOpenFormNode<RawOpenFormNode>
  depth: number
}

export function Item(props: ItemProps) {
  const { state, removeNode, addNode, updateNode, rootLineage } =
    useContext(OpenFormContext)
  const { selectedNode, setSelectedNode } = useOpenFormGraph()
  const { node, depth } = props
  const { nodes, links } = state
  const ctx = useContext(MainContext)

  const isFocus = node.id === selectedNode?.id
  const isHighlight = false // highlights.nodes.findIndex((n) => n.id === node.id) > -1
  const isActive = isHighlight || isFocus

  const fadeOut = !!selectedNode && !isActive

  return (
    <>
      {selectedNode?.id === node.id && (
        <div className={style.focus}>
          <IconButton
            color="secondary"
            onClick={() => {
              const lineage = searchParents(node.id, nodes, links).reverse()
              const url = createIframeUrl(ctx.rootUrl, {
                hash: node.hash,
                lineage: [...lineage.map((n) => n.hash), ...rootLineage],
              })
              window.open(url)
            }}
          >
            <FontAwesomeIcon icon={faExternalLink} />{" "}
          </IconButton>
          <BaseButton
            onClick={() =>
              updateNode(node.id, { hash: mockEthereumTransactionHash() })
            }
            color="secondary"
          >
            update seed
          </BaseButton>
          <BaseButton onClick={() => setSelectedNode(null)}>
            close live view
          </BaseButton>
        </div>
      )}
      <div className={classNames(style.item)}>
        <div
          className={classNames(style.val, {
            [style.opaque]: fadeOut,
            [style.highlights]: isHighlight && !isFocus,
          })}
        >
          <div>{depth}</div>
          <BaseInput value={node.hash} />
          <IconButton color="secondary" onClick={() => addNode(node.id)}>
            <FontAwesomeIcon icon={faShareNodes} />
          </IconButton>
          {node.hash === ctx.baseHash && <div>URL PARAM</div>}
          {node.hash !== ctx.baseHash && (
            <>
              <IconButton
                color="secondary"
                onClick={() => {
                  if (
                    window.confirm(
                      "Removing the hash will also remove all its children. Are you sure?"
                    )
                  ) {
                    removeNode(node.id)
                  }
                }}
              >
                <FontAwesomeIcon icon={faRemove} />
              </IconButton>
            </>
          )}
        </div>
      </div>
      <div className={style.children}>
        {node.children
          .map((c) => <Item key={c.id} node={c} depth={depth + 1} />)
          .reverse()}
      </div>
    </>
  )
}
