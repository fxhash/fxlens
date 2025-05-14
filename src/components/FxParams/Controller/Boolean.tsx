import { FxParamControllerProps, HTMLInputController } from "./Controller"

export function BooleanController(props: FxParamControllerProps<"boolean">) {
  const { ...rest } = props
  return (
    <HTMLInputController
      type="checkbox"
      layout="box"
      inputProps={{ checked: props.value }}
      {...rest}
    />
  )
}
