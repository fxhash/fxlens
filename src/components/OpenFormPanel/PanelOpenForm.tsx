import { OpenFormContext } from "@/context/OpenFormContext"
import { useContext } from "react"
import {
  BaseButton,
  BaseInput,
  BaseSelect,
  IconButton,
} from "../FxParams/BaseInput"
import style from "./PanelOpenForm.module.scss"
import { PanelGroup } from "../Panel/PanelGroup"
import { Item } from "./Item"
import { TriggerMode } from "@/utils/capture"
import { HTMLInputControllerWithTextInput } from "../FxParams/Controller/Controller"
import {
  CaptureTarget,
  ImageLoaderContext,
  PreviewSize,
} from "@/context/ImageLoader"
import { faSquare } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const LABELS: Record<string, string> = {
  DELAY: "After a fixed delay",
  FN_TRIGGER: "Programmatic trigger using $fx.preview()",
  SELECTOR: "Specific element by CSS Selector",
  VIEWPORT: "Capture the whole viewport",
}

export function PanelOpenForm() {
  const { addNode, tree, rootDepth, setRootDepth } = useContext(OpenFormContext)

  const {
    triggerMode,
    setTriggerMode,
    triggerDelay,
    setTriggerDelay,
    captureTarget,
    setCaptureTarget,
    width,
    height,
    setWidth,
    setHeight,
    cssSelector,
    setCssSelector,
    previewSize,
    setPreviewSize,
  } = useContext(ImageLoaderContext)

  return (
    <div className={style.panel}>
      <PanelGroup title="capture settings" collapsible>
        <div className={style.captureSettings}>
          <span className={style.label}>preview size</span>
          <div className={style.previewSize}>
            {(["xs", "sm", "lg"] as PreviewSize[]).map((size) => (
              <IconButton
                color={previewSize === size ? "primary" : "secondary"}
                onClick={() => setPreviewSize(size)}
              >
                <FontAwesomeIcon size={size} icon={faSquare} />
              </IconButton>
            ))}
          </div>
          <span className={style.label}>trigger</span>
          <BaseSelect
            name="mode"
            value={triggerMode}
            onChange={(evt) => setTriggerMode(evt.target.value as TriggerMode)}
          >
            {["DELAY", "FN_TRIGGER"].map((o) => (
              <option key={o} value={o}>
                {LABELS[o]}
              </option>
            ))}
          </BaseSelect>
          {triggerMode === "DELAY" && (
            <HTMLInputControllerWithTextInput
              id="delay"
              type="range"
              value={triggerDelay.toString()}
              onChange={(evt) => setTriggerDelay(Number(evt.target.value))}
              inputProps={{ min: 1, max: 60_000, step: 1 }}
              textInputProps={{
                type: "number",
                min: 1,
                max: 60_000,
                step: 1,
              }}
            />
          )}
          <BaseSelect
            name="target"
            value={captureTarget}
            onChange={(evt) =>
              setCaptureTarget(evt.target.value as CaptureTarget)
            }
          >
            {["VIEWPORT", "SELECTOR"].map((o) => (
              <option key={o} value={o}>
                {LABELS[o]}
              </option>
            ))}
          </BaseSelect>
          {captureTarget === "VIEWPORT" && (
            <div className={style.sizeInput}>
              <BaseInput
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
              />
              <span>x</span>
              <BaseInput
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
              />
            </div>
          )}
          {captureTarget === "SELECTOR" && (
            <BaseInput
              placeholder="canvas#my-canvas"
              value={cssSelector}
              onChange={(e) => setCssSelector(e.target.value)}
            />
          )}
        </div>
      </PanelGroup>
      <PanelGroup
        title="lineage"
        description="explore how your project evolves"
      >
        <div className={style.lineage}>
          <HTMLInputControllerWithTextInput
            id="root depth"
            type="range"
            value={rootDepth.toString()}
            onChange={(evt) => setRootDepth(Number(evt.target.value))}
            inputProps={{ min: 0, max: 20_000, step: 1 }}
            textInputProps={{
              type: "number",
              min: 0,
              max: 20_000,
              step: 1,
            }}
          />
          <BaseButton onClick={() => addNode()}>
            create new iteration at root
          </BaseButton>
        </div>
      </PanelGroup>
      <PanelGroup title="">
        {tree.map((node) => (
          <div key={node.id} className={style.root}>
            <Item node={node} depth={0} />
          </div>
        ))}
      </PanelGroup>
    </div>
  )
}
