import { Frame } from "components/Frame/Frame"
import { MainContext } from "context/MainContext"
import { useContext } from "react"
import style from "./App.module.scss"
import { Layout } from "./Layout"
import { PanelRoot } from "./Panel/PanelRoot"

export function App() {
  const ctx = useContext(MainContext)

  return (
    <div className={style.root}>
      <Layout panel={<PanelRoot />} frame={<Frame url={ctx.url} />} />
    </div>
  )
}
