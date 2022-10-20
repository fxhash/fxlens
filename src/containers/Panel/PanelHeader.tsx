import style from "./PanelHeader.module.scss"
import text from "styles/Text.module.scss"
import cs from "classnames"

interface Props {
  
}
export function PanelHeader({
  
}: Props) {
  return (
    <header className={cs(style.root)}>
      <strong>fx(lens)</strong>
      <small className={cs(text.info)}>Local environment for fxhash projects</small>
    </header>
  )
}