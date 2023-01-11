import {useMemo, ReactElement, ChangeEventHandler} from "react";
import {FxParamDefinition, FxParamType} from "types/fxparams";
import {FxParamControllerProps} from "./Controller";
import {BooleanController} from "./Boolean";
import {ColorController} from "./Color";
import {NumberController} from "./Number";
import {SelectController} from "./Select";
import {StringController} from "./String";

interface FxParamControllerDefiniton<Type extends FxParamType> {
  type: Type,
  controller: (props: FxParamControllerProps<Type>) => ReactElement
}

export type FxParamControllerDefinitions = {
  [T in FxParamType]: FxParamControllerDefiniton<T>
}

export const controllerDefinitions: FxParamControllerDefinitions = {
  number: {
    type: "number",
    controller: NumberController
  },
  string: {
    type: "string",
    controller: StringController
  },
  boolean: {
    type: "boolean",
    controller: BooleanController,
  },
  color: {
    type: "color",
    controller: ColorController,
  },
  select: {
    type: "select",
    controller: SelectController,
  },
}

export interface ParameterControllerProps {
  parameter: FxParamDefinition<FxParamType>,
  value: any,
  onChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>
}

export function ParameterController(props: ParameterControllerProps) {
  const { parameter } = props;
  
  const { controller: Controller } = useMemo(() => controllerDefinitions[parameter.type], [parameter.type])

  return (
    <Controller
      id={parameter.id}
      label={parameter.name}
      value={props.value}
      onChange={props.onChange}
      options={parameter.options}
    /> 
  )
}
