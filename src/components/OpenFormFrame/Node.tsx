import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { NestedOpenFormNode, RawOpenFormNode } from "./_types"
import style from "./Node.module.scss"
import { searchParents } from "./util"
import { createIframeUrl } from "@/utils/url"
import { MainContext } from "@/context/MainContext"
import { IconButton } from "../FxParams/BaseInput"
import { OpenFormContext } from "@/context/OpenFormContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRemove, faShareNodes } from "@fortawesome/free-solid-svg-icons"
import classNames from "classnames"
import { useOpenFormGraph } from "@fxhash/open-form-graph"
import { ImageLoaderContext, useImageLoader } from "@/context/ImageLoader"

interface NodeProps {
  x: number
  y: number
  node: NestedOpenFormNode<RawOpenFormNode>
  onAdd?: () => void
  onRemove?: () => void
}
export function Node(props: NodeProps) {
  const { state, addNode, removeNode, focusedNodeId, rootLineage } =
    useContext(OpenFormContext)
  const ctx = useContext(MainContext)
  const { previewSize, fastCapture } = useContext(ImageLoaderContext)
  const { setSelectedNodeById } = useOpenFormGraph()
  const { nodes, links } = state
  const { node, x, y, onAdd, onRemove } = props
  const [live, setLive] = useState(false)

  const iframeUrl = useMemo(() => {
    const lineage = searchParents(node.id, nodes, links).reverse()
    const url = createIframeUrl(ctx.baseUrl, {
      hash: node.hash,
      lineage: [...lineage.map((n) => n.hash), ...rootLineage],
      context: fastCapture ? "fast-capture" : "capture",
    })
    return url
  }, [node.hash, nodes, links, rootLineage])

  const { imageSrc, isLoading, error } = useImageLoader(
    `node-${node.id}`,
    !live ? iframeUrl.toString() : undefined,
    undefined,
    x
  )

  const contentSize = useMemo(() => {
    switch (previewSize) {
      case "xs":
        return { width: 100, height: 100 }
      case "sm":
        return { width: 200, height: 200 }
      case "lg":
        return { width: 400, height: 400 }
    }
  }, [previewSize])

  return (
    <div
      className={classNames(style.node, {
        [style.focus]: node.id === focusedNodeId,
      })}
    >
      <div className={style.header} style={{ color: "white" }}></div>
      <div
        className={style.content}
        onClick={() => {
          setSelectedNodeById(node.id)
        }}
        style={{ ...contentSize }}
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
