import style from "./PanelGroup.module.scss"
import cs from "classnames"
import { PropsWithChildren, useState } from "react"

type Props = PropsWithChildren<{
  title: string
  description?: string
  descriptionClassName?: string
  expanded?: boolean
  isExpandable?: boolean
}>
export function PanelGroup({
  title,
  description,
  descriptionClassName,
  children,
  expanded = true,
  isExpandable = false,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(expanded)

  const toggleExpanded = () => {
    if (isExpandable) {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <div className={cs(style.root, { [style.expanded]: !isExpanded })}>
      <h2 
        className={cs(style.title, { [style.expandable]: isExpandable })}
        onClick={toggleExpanded}
      >
        {title}
      </h2>
      {description && (
        <p className={cs(style.description, descriptionClassName)}>
          {description}
        </p>
      )}
      {isExpanded && <div className={cs(style.content)}>{children}</div>}
    </div>
  )
}
