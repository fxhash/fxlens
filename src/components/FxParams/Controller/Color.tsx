import { useState, useEffect, useRef, LegacyRef, MutableRefObject, RefObject, ChangeEvent } from "react";
import { ChromePicker, ColorResult } from "react-color"
import {rgbaToHex} from "../utils";
import { FxParamControllerProps, Controller, BaseParamsInput } from "./Controller"
import classes from './Color.module.scss'

export function ColorController(props: FxParamControllerProps<"color">) {
  const ref = useRef<HTMLDivElement>(null);
  const { label, id, onChange, value, layout = "box" } = props;
  const [showPicker, setShowPicker] = useState(false)
  const handleToggleShowPicker = () => {
    setShowPicker(show => !show)
  }
  const handlePickerChange = (color: ColorResult) => {
    const { rgb } = color;
    onChange(rgbaToHex(rgb.r, rgb.g, rgb.b, rgb.a || 1))
  }
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
       if (ref.current && !ref.current?.contains(event.target as Node)) {
         setShowPicker(false) 
       }
    }
    window.addEventListener("mousedown", handleClickOutside)
    return () => {
      window.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref])
  return (
    <Controller id={id} label={label} layout={layout} className={classes.pickerWrapper} inputContainerProps={{ref}}>
      <button className={classes.square} style={{ background: value}} onClick={handleToggleShowPicker} />
      <BaseParamsInput type="text" id={`text-${id}`} onChange={handleInputChange} value={value} autoComplete="off" maxLength={9} minLength={2} />
      {showPicker && <ChromePicker  color={value} onChange={handlePickerChange} className={classes.picker} />}
    </Controller>
  )
}
