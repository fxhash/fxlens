import { useMemo, useRef } from "react"
import { usePaneOfParams } from "../../context/Params"
import classes from "./Pane.module.scss"

interface IPaneProps {
  params?: string[]
}
export function Pane(props: IPaneProps) {
  const params = useMemo(() => props.params, [JSON.stringify(props.params)])
  const paneRef = useRef<HTMLDivElement>(null)
  const tweakpane = usePaneOfParams(params, paneRef)

  return <div ref={paneRef} className={classes.pane} />
}
