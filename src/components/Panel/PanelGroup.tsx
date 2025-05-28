import style from "./PanelGroup.module.scss"
import cs from "classnames"
import { PropsWithChildren, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faChevronDown,
  faChevronRight,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons"

type Props = PropsWithChildren<{
  title: string
  description?: string
  descriptionClassName?: string
  collapsible?: boolean
}>

export function PanelGroup({
  title,
  description,
  descriptionClassName,
  children,
  collapsible = false,
}: Props) {
  const [open, setOpen] = useState(true)

  const handleToggle = () => {
    if (collapsible) setOpen((o) => !o)
  }

  return (
    <div className={cs(style.root)}>
      <h2
        className={cs(style.title, collapsible && style.collapsibleTitle)}
        onClick={handleToggle}
        style={
          collapsible ? { cursor: "pointer", userSelect: "none" } : undefined
        }
      >
        {title}
        {collapsible && (
          <FontAwesomeIcon
            size="xs"
            icon={open ? faChevronDown : faChevronRight}
            style={{ marginLeft: 8, transition: "transform 0.2s" }}
          />
        )}
      </h2>
      {description && (
        <p className={cs(style.description, descriptionClassName)}>
          {description}
        </p>
      )}
      {(!collapsible || open) && (
        <div className={cs(style.content)}>{children}</div>
      )}
    </div>
  )
}
