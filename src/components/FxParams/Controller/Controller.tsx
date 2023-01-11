import { ChangeEventHandler, HTMLInputTypeAttribute, InputHTMLAttributes, ReactNode} from "react"
import {FxParamDefinition, FxParamOptionsMap, FxParamType} from "types/fxparams"
import classes from './Controller.module.scss'

export interface ControllerProps {
  label?: string
  id?: string
  children: ReactNode
}

export function Controller(props: ControllerProps) {
  const { id , label } = props;
  return (
    <div className={classes.controller}>
      { label && id && <label htmlFor={id}>{label}</label> }
      <div className={classes.inputContainer}>
        {props.children}
      </div>
    </div>
  )
}

export interface HTMLInputControllerProps {
  id: string
  value: string
  onChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>
  type: HTMLInputTypeAttribute,
  inputOptions?: InputHTMLAttributes<HTMLInputElement | HTMLSelectElement>
  className?: string,
  label?: string
}

export type FxParamControllerProps<Type extends FxParamType> = Omit<HTMLInputControllerProps, "type"> 
  & {value: any, options?: FxParamOptionsMap[Type] }

export function HTMLInputController(props: HTMLInputControllerProps) {
  const { label, id, onChange, value, type, className } = props;
  return (
    <Controller id={id} label={label}> 
      <input className={className} type={type} name={id} id={id} onChange={onChange} value={value}/>
    </Controller>

  )
}

export function HTMLInputControllerWithTextInput(props: HTMLInputControllerProps) {
  const { label, id, onChange, value, type, className, inputOptions = {} } = props;
  console.log(inputOptions)
  return (
    <Controller id={id} label={label}>
      <input className={className} type={type} name={id} id={id} onChange={onChange} value={value} {...inputOptions}/>
      <input type="text" id={`text-${id}`} onChange={onChange} value={value}/>
    </Controller>

  )
}

