import { FxParamControllerProps, HTMLInputControllerWithTextInput } from "./Controller"
import classes from './Controller.module.scss'

export function NumberController(props: FxParamControllerProps<"number">) {
  const { options } = props;
  const min = options?.min || 0;
  const max = options?.max || 100;
  const step = options?.step || 1;
  return (
    <HTMLInputControllerWithTextInput type="range" className={classes.slider} inputOptions={{ min, max, step}} {...props} />
  )
}
