import { Controller, FxParamControllerProps } from "./Controller"

export function SelectController({id, label, value, onChange, options} : FxParamControllerProps<"select">) {

  return (
    <Controller id={id} label={label}>
      <select name={id} id={id} onChange={onChange} value={value}>
        {options?.options.map((o) => <option key={o} value={o} >{o}</option>)}
      </select>
    </Controller>
  )
}
