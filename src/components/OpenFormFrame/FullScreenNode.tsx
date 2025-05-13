
import { useContext, useMemo } from "react";
import style from "./Node.module.scss"
import { searchParents } from "./util";
import { createIframeUrl } from "@/utils/url";
import { OpenFormContext } from "@/context/OpenFormContext";
import classNames from "classnames";
import { MainContext } from "@/context/MainContext";

interface NodeProps {
  hash: string
}
export function FullscreenNode(props: NodeProps) {
  const { state } = useContext(OpenFormContext)
  const ctx = useContext(MainContext);
  const { nodes, links } = state
  const { hash, } = props

  const iframeUrl = useMemo(() => {
    const lineage = searchParents(hash, nodes, links).reverse()
    const url = createIframeUrl(ctx.baseUrl, {
      hash: hash,
      lineage: [...lineage.map((n) => n.hash)],
    });
    return url
  }, [hash, nodes, links])


  return (
    <div className={classNames(style.full)}>
      <iframe src={iframeUrl.toString()} />
    </div >
  )
}
