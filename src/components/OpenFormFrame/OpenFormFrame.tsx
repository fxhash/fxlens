import { useContext, useMemo, } from "react";
import style from "./OpenFormFrame.module.scss"
import { Node } from "./Node";
import { OpenFormContext } from "@/context/OpenFormContext";
import { FullscreenNode } from "./FullScreenNode";
import { useOpenFormGraph } from "@fxhash/open-form-graph";

export function OpenFormFrame() {
  const { addNode, removeNode, tree, state } = useContext(OpenFormContext)
  const { selectedNode } = useOpenFormGraph()
  const _selectedNode = useMemo(() => {
    return state.nodes.find((n) => n.id === selectedNode?.id)
  }, [selectedNode])
  return (
    <div className={style.container}>
      {!selectedNode &&
        <>
          {tree.map((node, i) => (
            <Node
              key={node.id}
              node={node}
              x={0}
              y={i}
              onAdd={() => addNode(node.id)}
              onRemove={() => removeNode(node.id)}
            />
          ))}
        </>
      }
      {_selectedNode && <FullscreenNode hash={_selectedNode?.id} />}
    </div>
  );
}
