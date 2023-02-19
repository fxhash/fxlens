import {
  FxParamControllerProps,
  HTMLInputControllerWithTextInput,
} from "./Controller"
import classes from "./Controller.module.scss"

export function BigIntController(props: FxParamControllerProps<"bigint">) {
  const { options, value } = props
  const min = options?.min || 0
  const max = options?.max || 100
  const stringValue = `${value}`
  return (
    <HTMLInputControllerWithTextInput
      type="range"
      inputProps={{ min: `${min}`, max: `${max}` }}
      textInputProps={{
        type: "number",
        min: `${min}`,
        max: `${max}`,
        className: classes.numberInput,
      }}
      {...props}
      value={stringValue}
    />
  )
}
