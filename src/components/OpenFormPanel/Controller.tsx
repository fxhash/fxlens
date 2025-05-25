// Props for the controller component
import { ReactNode } from 'react'
import cx from 'classnames'
import styles from "./Controller.module.scss"

export interface ControllerProps {
  label?: string
  id?: string
  children: ReactNode
  className?: string
}

// Simple controller component that provides a label and container for inputs
export function Controller(props: ControllerProps) {
  const { id, label, className } = props
  return (
    <div className={cx(styles.controller, className)}>
      {id && <label htmlFor={id}>{label || id}</label>}
      <div className={styles.inputContainer}>
        {props.children}
      </div>
    </div>
  )
}
