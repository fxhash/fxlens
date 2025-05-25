import { useContext, ChangeEvent } from "react"
import { OpenFormContext } from "@/context/OpenFormContext"
import { CaptureTarget as CaptureTargetEnum } from "@/utils/capture"
import { BaseSelect, SelectOptions, BaseText } from "../BaseInput"

export function CaptureTargetControl() {
  const { captureTarget, setCaptureTarget, captureSelector, setCaptureSelector } = useContext(OpenFormContext)

  const options: SelectOptions[] = [
    { value: CaptureTargetEnum.VIEWPORT, label: "Viewport" },
    { value: CaptureTargetEnum.CANVAS, label: "Canvas" }
  ]

  const handleTargetChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCaptureTarget(e.target.value as CaptureTargetEnum)
  }

  const handleSelectorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCaptureSelector(e.target.value)
  }

  return (
    <div>
      <BaseSelect
        id="capture-target"
        label="Capture Target"
        value={captureTarget}
        onChange={handleTargetChange}
        options={options}
      />

      {captureTarget === CaptureTargetEnum.CANVAS && (
        <BaseText
          id="capture-selector"
          label="Capture CSS Selector"
          value={captureSelector}
          onChange={handleSelectorChange}
          inputProps={{
            placeholder: "e.g. #canvas, .my-element"
          }}
        />
      )}
    </div>
  )
}
