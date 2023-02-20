import { createRef, useEffect, useContext, useMemo } from "react"
import { consolidateParams } from "components/FxParams/utils"
import { ParameterController } from "./Controller/Param"
import { FxParamsContext } from "./Context"
import { LockButton } from "./LockButton/LockButton"
import classes from "./Controls.module.scss"
import { validateParameterDefinition } from "./validation"

interface ControllerBladeProps {
  parameter: any
  onClickLockButton?: (id: string) => void
  lockedParamIds?: string[]
  onChangeParam: (id: string, value: any) => void
}

function ControllerBlade(props: ControllerBladeProps) {
  const { parameter, onClickLockButton, lockedParamIds, onChangeParam } = props
  const parsed = useMemo(
    () => validateParameterDefinition(parameter),
    [parameter]
  )
  const isValid = useMemo(() => parsed && parsed.success, [parsed])
  return (
    <div className={classes.blade}>
      <ParameterController
        parameter={parameter}
        value={parameter.value}
        onChange={onChangeParam}
      />
      {onClickLockButton && isValid && (
        <LockButton
          className={classes.lockButton}
          title={`toggle lock ${parameter.id} param`}
          isLocked={lockedParamIds?.includes(parameter.id)}
          onClick={(e) => onClickLockButton(parameter.id)}
        />
      )}
    </div>
  )
}

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
          <ControllerBlade
            key={p.id}
            parameter={p}
            onChangeParam={handleChangeParam}
            lockedParamIds={lockedParamIds}
            onClickLockButton={onClickLockButton}
          />
        )
      })}
    </div>
  )
}
