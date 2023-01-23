import { HTMLInputTypeAttribute, InputHTMLAttributes, ReactNode, forwardRef, RefObject, ForwardedRef} from "react"
import { FxParamOptionsMap, FxParamType} from "../types"
import { FxParamControllerChangeHandlerMap } from "./Param"
import classes from './Controller.module.scss'
import cx from 'classnames'

/*
 * Providing a name starting or ending with `search` prevents
 * 1Password extension to appear in the input fields
 * https://1password.community/discussion/comment/606453/#Comment_606453
 */
export function BaseInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { id } = props;
  return <input name={`${id}-params-search`} autoComplete="off" {...props} /> 
}

export type FxParamInputChangeHandler = (e: any) => void

export interface ControllerProps {
  label?: string
  id?: string
  children: ReactNode
  layout?: "default" | "invert" | "box",
  className?: string,
  inputContainerProps?: {
    ref: RefObject<HTMLDivElement>
  }
}

export function Controller(props: ControllerProps)  {
  const { id , label, layout = "default", className, inputContainerProps } = props;
  return (
    <div className={cx(classes.controller, classes[layout], className)}>
      { label && id && <label htmlFor={id}>{label}</label> }
      <div className={classes.inputContainer} {...inputContainerProps}>
        {props.children}
      </div>
    </div>
  )
}

export interface HTMLInputControllerProps {
  id: string
  value: string,
  onChange: FxParamInputChangeHandler
  type: HTMLInputTypeAttribute,
  inputProps?: InputHTMLAttributes<HTMLInputElement | HTMLSelectElement>
  className?: string,
  label?: string
  layout?: "default" | "invert" | "box",
}

export type FxParamControllerProps<Type extends FxParamType> = Omit<HTMLInputControllerProps, "type"> 
& {value: any, options?: FxParamOptionsMap[Type], onChange: FxParamControllerChangeHandlerMap[Type]}

export function HTMLInputController(props: HTMLInputControllerProps) {
  const { label, id, onChange, value, type, className, inputProps = {}, layout="default" } = props;
  return (
    <Controller id={id} label={label} layout={layout}> 
      <BaseInput className={className} type={type} id={id} onChange={onChange} value={value} {...inputProps} />
    </Controller>

  )
}

export interface HTMLInputControllerWithTextInputProps extends HTMLInputControllerProps {
}

export function HTMLInputControllerWithTextInput(props: HTMLInputControllerWithTextInputProps) {
  const { label, id, onChange, value, type, className, inputProps = {}, layout = "default" } = props;
  return (
    <Controller id={id} label={label} layout={layout}>
      <BaseInput className={className} type={type} id={id} onChange={onChange} value={value} autoComplete="off" {...inputProps}/>
      <BaseInput type="text" id={`text-${id}`} onChange={onChange} value={value} autoComplete="off" />
    </Controller>
  )
}

