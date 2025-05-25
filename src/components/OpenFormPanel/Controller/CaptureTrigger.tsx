import { useContext, ChangeEvent } from "react"
import { OpenFormContext } from "@/context/OpenFormContext"
import { CaptureTrigger as CaptureTriggerEnum } from "@/utils/capture"
import { BaseSelect, SelectOptions, BaseNumberInput } from "../BaseInput"

export function CaptureTriggerControl() {
  const { captureTrigger, setCaptureTrigger, captureDelay, setCaptureDelay } = useContext(OpenFormContext)

  const min = 0
  const max = 2000
  const step = 100

  const options: SelectOptions[] = [
    { value: CaptureTriggerEnum.ON_LOAD, label: "On Load" },
    { value: CaptureTriggerEnum.PROGRAMMATIC, label: "Programmatic Preview" },
    { value: CaptureTriggerEnum.FIXED_DELAY, label: "Fixed Delay" }
  ]

  const handleTriggerChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCaptureTrigger(e.target.value as CaptureTriggerEnum)
  }

  const handleDelayChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value)
    if (isNaN(value)) {
      value = min
    }
    value = Math.floor(value / step) * step
    value = Math.max(Math.min(value, max), min)
    setCaptureDelay(value)
  }

  return (
    <div>
      <BaseSelect
        id="capture-trigger"
        label="Capture Trigger"
        value={captureTrigger}
        onChange={handleTriggerChange}
        options={options}
      />

      {captureTrigger === CaptureTriggerEnum.FIXED_DELAY && (
        <BaseNumberInput
          id="capture-delay"
          label="Capture Delay (ms)"
          inputProps={{ min, max, step }}
          value={captureDelay.toString()}
          onChange={handleDelayChange}
        />
      )}
    </div>
  )
}
