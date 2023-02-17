import { createRef, useEffect, useContext } from "react"
import { consolidateParams } from "components/FxParams/utils"
import { ParameterController } from "./Controller/Param"
import { FxParamsContext } from "./Context"
import { LockButton } from "./LockButton/LockButton"
import classes from "./Controls.module.scss"

interface ControlsProps {
  params: any
  onClickLockButton?: (id: string) => void
  lockedParamIds?: string[]
}
export const Controls = ({
  params,
  onClickLockButton,
  lockedParamIds,
}: ControlsProps) => {
  const ctx = useContext(FxParamsContext)

  const consolidatedParams = consolidateParams(params, ctx.data)

  const p: React.RefObject<HTMLDivElement> = createRef()

  useEffect(() => {
    const ps: any = {}
    if (consolidatedParams?.length > 0) {
      consolidatedParams.forEach((p: any) => {
        ps[p.id] = p.value
      })
      ctx.setData(ps)
    }
  }, [params])

  const handleChangeParam = (id: string, value: any) => {
    ctx.setData({ ...ctx.data, [id]: value })
  }

  return (
    <div className={classes.controls} ref={p}>
      {consolidatedParams?.map((p: any) => {
        return (
          <div key={p.id} className={classes.blade}>
            <ParameterController
              key={p.id}
              parameter={p}
              value={p.value}
              onChange={handleChangeParam}
            />
            {onClickLockButton && (
              <LockButton
                title={`toggle lock ${p.id} param`}
                isLocked={lockedParamIds?.includes(p.id)}
                onClick={(e) => onClickLockButton(p.id)}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
