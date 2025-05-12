import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { NestedOpenFormNode, RawOpenFormNode } from "./_types";
import style from "./Node.module.scss"
import { searchParents } from "./util";
import { captureURL } from "@/utils/capture";
import { createIframeUrl } from "@/utils/url";
import { MainContext } from "@/context/MainContext";
import { IconButton } from "../FxParams/BaseInput";
import { OpenFormContext } from "@/context/OpenFormContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRemove, faShareNodes } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { useOpenFormGraph } from "@fxhash/open-form-graph";

interface NodeProps {
  x: number
  y: number
  node: NestedOpenFormNode<RawOpenFormNode>
  onAdd?: () => void
  onRemove?: () => void
}
export function Node(props: NodeProps) {
  const { state, addNode, removeNode, focusedNodeId } = useContext(OpenFormContext)
  const ctx = useContext(MainContext);
  const { onClickNode } = useOpenFormGraph()
  const { nodes, links } = state
  const { node, x, y, onAdd, onRemove, } = props
  const [isLoading, setIsLoading] = useState(false)
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [live, setLive] = useState(false)
  const hashRef = useRef<string | null>(null)

  const iframeUrl = useMemo(() => {
    const lineage = searchParents(node.hash, nodes, links)
    const url = createIframeUrl(ctx.baseUrl, {
      hash: node.hash,
      lineage: [...lineage.map((n) => n.hash), node.hash],
    });
    return url
  }, [node.hash, nodes, links])

  useEffect(() => {
    if (!iframeUrl || live || hashRef.current === node.hash) return
    async function loadImage() {
      setError(undefined)
      setIsLoading(true)
      try {
        console.log(`Loading image for node ${node.hash}`);
        const imageData = await captureURL(iframeUrl.toString());
        setImgSrc(imageData)
        setIsLoading(false)
        hashRef.current = node.hash
      }
      catch (error) {
        console.error(`Error loading image for node ${node.hash}:`, error);
        setImgSrc(undefined)
        setIsLoading(false)
        setError(error as Error)
      }
    }
    loadImage()
  }, [iframeUrl])

  return (
    <div className={classNames(style.node, { [style.focus]: node.id === focusedNodeId })}
    >
      <div className={style.header}>
      </div>
      <div className={style.content}
        onClick={() => {
          onClickNode(node.hash)
        }}
      >
        {!live &&
          <>
            {isLoading && <div className={style.loading}>loading</div>}
            {!isLoading && imgSrc && (
              <img
                src={imgSrc}
                alt={`Node ${node.hash.substring(0, 8)}`}
                className="node-preview"
              />)}
            {error && (
              <div>{error.message}</div>
            )}</>
        }
        {live && iframeUrl && <iframe src={iframeUrl.toString()} />}
        <IconButton className={style.del} onClick={(e) => {
          e.stopPropagation()
          onRemove?.()
        }} color="secondary">
          <FontAwesomeIcon icon={faRemove} />
        </IconButton>
      </div>
      <div className={style.footer}>
        <IconButton color="secondary" onClick={() => onAdd?.()}>
          <FontAwesomeIcon icon={faShareNodes} />
        </IconButton>
      </div>
      {node.children.length > 0 &&
        <div className={style.children}>
          {node.children.map(c =>
            <Node
              key={c.hash}
              node={c}
              x={x + 1}
              y={y}
              onAdd={() => addNode(c.hash)}
              onRemove={() => removeNode(c.hash)}
            />).reverse()}
        </div>
      }
    </div >
  )
}
