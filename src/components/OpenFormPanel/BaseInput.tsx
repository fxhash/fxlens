import { ChangeEvent, InputHTMLAttributes, useState } from 'react'
import cx from 'classnames'
import styles from './BaseInput.module.scss'
import { Controller } from './Controller'

// Simple base input component
export function BaseInput (props: InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props
  return <input className={cx(styles.baseInput, className)} {...rest} />
}

// Props for the input controller with number input
export interface BaseNumberInputProps {
  id: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  label?: string
  inputProps?: InputHTMLAttributes<HTMLInputElement>
}

// Component that combines a range input with a number input
export function BaseNumberInput (props: BaseNumberInputProps) {
  const {
    label,
    id,
    onChange,
    value,
    inputProps = {},
  } = props

  const [val, setVal] = useState(value)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value)
    onChange(e)
  }

  return (
    <Controller id={id} label={label}>
      <BaseInput
        type="range"
        id={id}
        onChange={handleChange}
        value={val}
        autoComplete="off"
        {...inputProps}
      />
      <BaseInput
        type="number"
        id={`number-${id}`}
        onChange={handleChange}
        value={val}
        autoComplete="off"
        {...inputProps}
      />
    </Controller>
  )
}

export interface SelectOptions {
  value: string
  label: string
}

export interface SelectProps {
  id: string
  value: string
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  options: SelectOptions[]
  label?: string
  selectProps?: InputHTMLAttributes<HTMLSelectElement>
}

export function BaseSelect (props: SelectProps) {
  const {
    label,
    id,
    onChange,
    value,
    options,
    selectProps = {},
  } = props

  return (
    <Controller id={id} label={label}>
      <select
        id={id}
        onChange={onChange}
        value={value}
        className={cx(styles.baseInput)}
        {...selectProps}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Controller>
  )
}

export interface BaseTextProps {
  id: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  label?: string
  inputProps?: InputHTMLAttributes<HTMLInputElement>
}

export function BaseText (props: BaseTextProps) {
  const {
    label,
    id,
    onChange,
    value,
    inputProps = {},
  } = props

  return (
    <Controller id={id} label={label}>
      <BaseInput
        type="text"
        id={id}
        onChange={onChange}
        value={value}
        autoComplete="off"
        {...inputProps}
      />
    </Controller>
  )
}
