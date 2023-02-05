import style from "./Layout.module.scss"
import cs from "classnames"
import { ReactNode } from "react"

interface Props {
  panel: ReactNode
  frame: ReactNode
}
export function Layout({ panel, frame }: Props) {
  return (
    <div className={cs(style.root)}>
      <div className={cs(style.panel)}>{panel}</div>
      <div className={cs(style.frame)}>{frame}</div>
    </div>
  )
}
