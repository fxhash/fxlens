import { useContext, useMemo } from "react"
import style from "./Node.module.scss"
import { searchParents } from "./util"
import { createIframeUrl } from "@/utils/url"
import { OpenFormContext } from "@/context/OpenFormContext"
import classNames from "classnames"
import { MainContext } from "@/context/MainContext"

interface NodeProps {
  id: string
  hash: string
}
export function FullscreenNode(props: NodeProps) {
  const { state, rootLineage } = useContext(OpenFormContext)
  const ctx = useContext(MainContext)
  const { nodes, links } = state
  const { hash, id } = props

  const iframeUrl = useMemo(() => {
    const lineage = searchParents(id, nodes, links).reverse()
    const url = createIframeUrl(ctx.baseUrl, {
      hash: hash,
      lineage: [...rootLineage, ...lineage.map((n) => n.hash)],
    })
    return url
  }, [hash, nodes, links, id, rootLineage, ctx.baseUrl])

  return (
    <div className={classNames(style.full)}>
      <iframe src={iframeUrl.toString()} />
    </div>
  )
}
