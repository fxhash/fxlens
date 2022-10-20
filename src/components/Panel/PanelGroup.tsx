import style from "./PanelGroup.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  title: string
  description?: string
}>
export function PanelGroup({
  title,
  description,
  children,
}: Props) {
  return (
    <div className={cs(style.root)}>
      <h2 className={cs(style.title)}>{title}</h2>
      {description && (
        <p className={cs(style.description)}>
          {description}
        </p>
      )}
      <div className={cs(style.content)}>
        {children}
      </div>
    </div>
  )
}