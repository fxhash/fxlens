import { FxParamControllerProps, HTMLInputController } from "./Controller"

export function ColorController(props: FxParamControllerProps<"color">) {

  return (
    <HTMLInputController type="color" {...props} />
  )
}
