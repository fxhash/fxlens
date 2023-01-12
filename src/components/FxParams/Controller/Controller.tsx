import { ChangeEventHandler, HTMLInputTypeAttribute, InputHTMLAttributes, ReactNode} from "react"
import {FxParamDefinition, FxParamOptionsMap, FxParamType} from "types/fxparams"
import classes from './Controller.module.scss'
import cx from 'classnames'

export type FxParamControllerChangeHandler = (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => any

export interface ControllerProps {
  label?: string
  id?: string
  children: ReactNode
  layout?: "default" | "invert" | "box",
}

export function Controller(props: ControllerProps) {
  const { id , label, layout = "default" } = props;
  return (
    <div className={cx(classes.controller, classes[layout])}>
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
  onChange: FxParamControllerChangeHandler
  type: HTMLInputTypeAttribute,
  inputOptions?: InputHTMLAttributes<HTMLInputElement | HTMLSelectElement>
  className?: string,
  label?: string
  layout?: "default" | "invert" | "box",
}

export type FxParamControllerProps<Type extends FxParamType> = Omit<HTMLInputControllerProps, "type"> 
& {value: any, options?: FxParamOptionsMap[Type]}

export function HTMLInputController(props: HTMLInputControllerProps) {
  const { label, id, onChange, value, type, className, inputOptions = {}, layout="default" } = props;
  return (
    <Controller id={id} label={label} layout={layout}> 
      <input className={className} type={type} name={id} id={id} onChange={onChange} value={value} {...inputOptions}/>
    </Controller>

  )
}

export interface HTMLInputControllerWithTextInputProps extends HTMLInputControllerProps {
}

export function HTMLInputControllerWithTextInput(props: HTMLInputControllerWithTextInputProps) {
  const { label, id, onChange, value, type, className, inputOptions = {}, layout = "default" } = props;
  return (
    <Controller id={id} label={label} layout={layout}>
      <input className={className} type={type} name={id} id={id} onChange={onChange} value={value} {...inputOptions}/>
      <input type="text" id={`text-${id}`} onChange={onChange} value={value}/>
    </Controller>

  )
}

