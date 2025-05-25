import { useContext, useMemo } from "react"
import { NestedOpenFormNode, RawOpenFormNode } from "./_types"
import style from "./Node.module.scss"
import { searchParents } from "./util"
import { captureURL, CaptureOptions } from "@/utils/capture"
import { createIframeUrl } from "@/utils/url"
import { MainContext } from "@/context/MainContext"
import { IconButton } from "../FxParams/BaseInput"
import { OpenFormContext } from "@/context/OpenFormContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRemove, faShareNodes } from "@fortawesome/free-solid-svg-icons"
import classNames from "classnames"
import { useOpenFormGraph } from "@fxhash/open-form-graph"
import { useImageLoader } from "@/context/ImageLoader"

interface NodeProps {
  x: number
  y: number
  node: NestedOpenFormNode<RawOpenFormNode>
  onAdd?: () => void
  onRemove?: () => void
}
export function Node(props: NodeProps) {
  const { 
    state, 
    addNode, 
    removeNode, 
    focusedNodeId, 
    previewSize,
    captureTrigger,
    captureTarget,
    captureDelay,
    captureSelector
  } = useContext(OpenFormContext)
  const ctx = useContext(MainContext)
  const { onClickNode } = useOpenFormGraph()
  const { nodes, links } = state
  const { node, x, y, onAdd, onRemove } = props
  const live = false

  const iframeUrl = useMemo(() => {
    const lineage = searchParents(node.id, nodes, links).reverse()
    const url = createIframeUrl(ctx.baseUrl, {
      hash: node.hash,
      lineage: [...lineage.map((n) => n.hash)],
    })
    return url
  }, [node.hash, nodes, links])

  // Create capture options from context settings
  const captureOptions: CaptureOptions = {
    trigger: captureTrigger,
    target: captureTarget,
    delay: captureDelay,
    selector: captureSelector
  }

  // Custom capture function that passes options to captureURL
  const captureWithOptions = (url: string) => captureURL(url, captureOptions)

  const { imageSrc, isLoading, error } = useImageLoader(
    `node-${node.id}`,
    !live ? iframeUrl.toString() : undefined,
    captureWithOptions,
    x
  )

  return (
    <div
      className={classNames(style.node, {
        [style.focus]: node.id === focusedNodeId,
      })}
    >
      <div className={style.header} style={{ color: "white" }}></div>
      <div
        className={style.content}
        style={{ height: `${previewSize}px`, width: `${previewSize}px` }}
        onClick={() => {
          onClickNode(node.id)
        }}
      >
        {!live && (
          <>
            {isLoading && <div className={style.loading}>loading</div>}
            {!isLoading && imageSrc && (
              <img
                src={imageSrc}
                alt={`Node ${node.hash.substring(0, 8)}`}
                className="node-preview"
              />
            )}
            {error && <div>{error.message}</div>}
          </>
        )}
        {live && iframeUrl && <iframe src={iframeUrl.toString()} />}
        <IconButton
          className={style.del}
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          color="secondary"
        >
          <FontAwesomeIcon icon={faRemove} />
        </IconButton>
      </div>
      <div className={style.footer}>
        <IconButton color="secondary" onClick={() => onAdd?.()}>
          <FontAwesomeIcon icon={faShareNodes} />
        </IconButton>
      </div>
      {node.children.length > 0 && (
        <div className={style.children}>
          {node.children
            .map((c) => (
              <Node
                key={c.id}
                node={c}
                x={x + 1}
                y={y}
                onAdd={() => addNode(c.id)}
                onRemove={() => removeNode(c.id)}
              />
            ))
            .reverse()}
        </div>
      )}
    </div>
  )
}
