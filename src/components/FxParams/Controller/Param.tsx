import { useMemo, ReactElement } from "react"
import { FxParamDefinition, FxParamType } from "../types"
import { FxParamInputChangeHandler, FxParamControllerProps } from "./Controller"
import { BooleanController } from "./Boolean"
import { ColorController } from "./Color"
import { NumberController } from "./Number"
import { SelectController } from "./Select"
import { StringController } from "./String"
import { validateParameterDefinition } from "../validation"
import { ControllerInvalid } from "./Invalid"
export interface FxParamControllerChangeHandlerMap {
  number: FxParamInputChangeHandler
  string: FxParamInputChangeHandler
  boolean: FxParamInputChangeHandler
  color: FxParamInputChangeHandler
  select: FxParamInputChangeHandler
}

interface FxParamControllerDefiniton<Type extends FxParamType> {
  type: Type
  controller: (props: FxParamControllerProps<Type>) => ReactElement
  handler: FxParamInputChangeHandler
}

export type FxParamControllerDefinitions = {
  [T in FxParamType]: FxParamControllerDefiniton<T>
}

export const controllerDefinitions: FxParamControllerDefinitions = {
  number: {
    type: "number",
    controller: NumberController,
    handler: (e) => Number(e.target.value),
  },
  integer: {
    type: "integer",
    controller: NumberController,
    handler: (e) => Number(e.target.value),
  },
  string: {
    type: "string",
    controller: StringController,
    handler: (e) => e.target.value,
  },
  boolean: {
    type: "boolean",
    controller: BooleanController,
    handler: (e) => (e as React.ChangeEvent<HTMLInputElement>).target.checked,
  },
  color: {
    type: "color",
    controller: ColorController,
    handler: (v) => v,
  },
  select: {
    type: "select",
    controller: SelectController,
    handler: (e) => e.target.value,
  },
}

export interface ParameterControllerProps {
  parameter: FxParamDefinition<FxParamType>
  value: any
  onChange: (id: string, value: any) => void
}

export function ParameterController(props: ParameterControllerProps) {
  const { parameter, onChange } = props

  const parsed = useMemo(
    () => validateParameterDefinition(parameter),
    [parameter]
  )
  const { controller: Controller, handler } = useMemo(
    () => controllerDefinitions[parameter.type],
    [parameter.type]
  )

  const handleChangeParam = (e: any) => {
    const value = handler(e)
    onChange(parameter.id, value)
  }

  if (parsed && !parsed.success)
    return <ControllerInvalid definition={parameter} error={parsed.error} />

  return (
    <Controller
      id={parameter.id}
      label={parameter.name}
      value={props.value}
      onChange={handleChangeParam}
      // TODO: This should be properly casted
      options={parameter.options as any}
    />
  )
}
