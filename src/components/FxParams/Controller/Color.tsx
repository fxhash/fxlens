import {
  useState,
  useEffect,
  useRef,
  LegacyRef,
  MutableRefObject,
  RefObject,
  ChangeEvent,
  useMemo,
} from "react"
import { hexToRgba, rgbaToHex } from "../utils"
import {
  FxParamControllerProps,
  Controller,
  BaseParamsInput,
} from "./Controller"
import classes from "./Color.module.scss"
import { RgbaColor, RgbaColorPicker } from "react-colorful"
import cx from "classnames"
import { BaseButton } from "../BaseInput"

export function ColorController(props: FxParamControllerProps<"color">) {
  const ref = useRef<HTMLDivElement>(null)
  const { label, id, onChange, value, layout = "box", isCodeDriven } = props
  const [showPicker, setShowPicker] = useState(false)
  const handleToggleShowPicker = () => {
    setShowPicker((show) => !show)
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
  const handleChangeColor = (newColor: RgbaColor) => {
    onChange(rgbaToHex(newColor.r, newColor.g, newColor.b, newColor.a))
  }

  const color = useMemo(() => hexToRgba(value), [value])

  // TODO: Cleanup how colors are being passed
  // when params are submitted from code the hash is ommited
  // when randomizing in fxlens the hash is included
  const v = value.replace("#", "")

  return (
    <Controller
      id={id}
      label={label}
      layout={layout}
      className={classes.pickerWrapper}
      inputContainerProps={{ ref }}
      isCodeDriven={isCodeDriven}
    >
      <BaseButton
        className={cx(classes.squaredButton, { [classes.active]: showPicker })}
        onClick={handleToggleShowPicker}
        disabled={isCodeDriven}
      >
        <div
          className={cx(classes.square, classes.leftTop)}
          style={{
            background: `linear-gradient(-45deg, #${v} 0%, #${v} 50%, #${v.slice(
              0,
              6
            )} 50%, #${v.slice(0, 6)} 100%)`,
          }}
        />
      </BaseButton>
      <BaseParamsInput
        type="text"
        id={`text-${id}`}
        onChange={handleInputChange}
        value={value}
        autoComplete="off"
        maxLength={9}
        minLength={2}
        disabled={isCodeDriven}
      />
      {showPicker && (
        <div className={classes.pickerAbsoluteWrapper}>
          <div className={classes.picker}>
            <RgbaColorPicker
              color={color}
              onChange={handleChangeColor}
              className={classes.colorful}
            />
          </div>
        </div>
      )}
    </Controller>
  )
}
