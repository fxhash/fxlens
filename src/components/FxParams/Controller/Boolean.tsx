import { FxParamControllerProps, HTMLInputController } from "./Controller"

export function BooleanController(props: FxParamControllerProps<"boolean">) {

  return (
    <HTMLInputController type="checkbox" {...props} />
  )
}
