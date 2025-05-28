import { MainContext } from "@/context/MainContext"
import style from "./Layout.module.scss"
import cs from "classnames"
import { ReactNode, useContext } from "react"

interface Props {
  panel: ReactNode
  frame: ReactNode
}
export function Layout({ panel, frame }: Props) {
  const ctx = useContext(MainContext)
  return (
    <div className={cs(style.root)}>
      <div className={cs(style.panel)}>{panel}</div>
      <div
        className={cs(style.frame, { [style.openFrame]: ctx.mode === "open" })}
      >
        {frame}
      </div>
    </div>
  )
}
