import style from "./PanelHeader.module.scss"
import cs from "classnames"

export function PanelHeader() {
  return (
    <header className={cs(style.root)}>
      <h1>fx(lens)</h1>
      <small>Local environment for fxhash projects</small>
    </header>
  )
}
