import { FxParamControllerProps, HTMLInputController } from "./Controller"

export function StringController(props: FxParamControllerProps<"string">) {

  return (
    <HTMLInputController type="text" {...props} />
  )
}
