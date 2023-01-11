import { FxParamControllerProps, HTMLInputController, HTMLInputControllerWithTextInput } from "./Controller"
import classes from './Controller.module.scss'

export function ColorController(props: FxParamControllerProps<"color">) {

  return (
    <HTMLInputControllerWithTextInput type="color" layout="box" className={classes.colorInput}{...props} />
  )
}
