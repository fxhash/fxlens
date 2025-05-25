import { ChangeEvent, useContext } from 'react'
import { OpenFormContext } from '@/context/OpenFormContext'
import { BaseNumberInput } from '@/components/OpenFormPanel/BaseInput'
import { CAPTURE_SIZE } from '@/utils/capture'

export function PreviewSize () {
  const { previewSize, setPreviewSize } = useContext(OpenFormContext)

  const min = 100
  const max = CAPTURE_SIZE
  const step = 10
  const stringValue = `${previewSize}`

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value)
    if (isNaN(value)) {
      value = min
    }
    value = Math.floor(value / step) * step
    value = Math.max(Math.min(value, max), min)
    setPreviewSize(value)
  }

  return (
    <BaseNumberInput
      id="preview-size"
      label="Preview Size"
      inputProps={{ min, max, step }}
      value={stringValue}
      onChange={handleChange}
    />
  )
}
