import { useContext, useMemo, } from "react";
import { RawOpenFormNode, RawOpenFormLink } from "./_types";
import { buildNestedStructureFromRoots } from "./util";
import style from "./OpenFormFrame.module.scss"
import { Node } from "./Node";
import { OpenFormContext } from "@/context/OpenFormContext";
import { BaseButton } from "../FxParams/BaseInput";

interface OpenFormFrameProps {
  nodes: RawOpenFormNode[];
  links: RawOpenFormLink[];
}

export function OpenFormFrame(props: OpenFormFrameProps) {

  const { addNode, removeNode, tree } = useContext(OpenFormContext)

  return (
    <div className={style.container}>
      {tree.map((node, i) => (
        <Node
          key={node.hash}
          node={node}
          x={0}
          y={i}
          onAdd={() => addNode(node.hash)}
          onRemove={() => removeNode(node.hash)}
        />
      ))}
    </div>
  );
}
