import { faRemove, faVolleyball } from "@fortawesome/free-solid-svg-icons";
import { BaseInput, IconButton } from "../FxParams/BaseInput";
import { NestedOpenFormNode } from "../OpenFormFrame/_types";
import style from "./PanelOpenForm.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OpenFormContext } from "@/context/OpenFormContext";
import { useContext } from "react";

interface ItemProps {
  node: NestedOpenFormNode
  depth: number
}

export function Item(props: ItemProps) {
  const { removeNode, addNode } = useContext(OpenFormContext)
  const { node, depth } = props
  return (
    <div className={style.item}>
      <div className={style.val}>
        <div>{depth}</div>
        <BaseInput value={node.hash} />
        <IconButton onClick={() => addNode(node.hash)} >
          <FontAwesomeIcon icon={faVolleyball} />
        </IconButton>
        <IconButton color="secondary" onClick={() => removeNode(node.hash)}>
          <FontAwesomeIcon icon={faRemove} />
        </IconButton>
      </div>
      <div className={style.children}>
        {node.children.map((c) => <Item key={c.hash} node={c} depth={depth + 1} />).reverse()}
      </div>
    </div>
  )
}
