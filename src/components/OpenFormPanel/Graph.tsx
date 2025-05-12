import { OpenFormGraph } from "@fxhash/open-form-graph"
import AutoSizer from "react-virtualized-auto-sizer"
import style from "./PanelOpenForm.module.scss"

export function Graph() {
  return (
    <div className={style.graphWrapper}>
      <div className={style.graph}>
        <AutoSizer>
          {({ height, width }) => {
            return <OpenFormGraph width={width} height={height} />
          }}
        </AutoSizer>
      </div>
    </div>

  )

}
