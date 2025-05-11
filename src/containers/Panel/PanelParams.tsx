import {
  Controls,
  ControlsOnChangeDataHandler,
} from "@/components/FxParams/Controls"
import { PanelGroup } from "@/components/Panel/PanelGroup"
import { useCallback, useContext, useMemo } from "react"
import { ProgressBar } from "@/components/ProgressBar/ProgressBar"
import { BaseButton, IconButton } from "@/components/FxParams/BaseInput"
import classes from "./PanelParams.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRotateLeft, faRotateRight } from "@fortawesome/free-solid-svg-icons"
import { ParamsHistoryContext } from "@/components/FxParams/ParamsHistory"
import { LockButton } from "@/components/FxParams/LockButton/LockButton"
import cx from "classnames"
import { useState } from "react"
import { MainContext } from "@/context/MainContext"
import { useMessageListener } from "@/components/FxParams/hooks"
import { RuntimeContext } from "@/context/RuntimeContext"
import { getRandomParamValues, FxParamDefinition, FxParamType } from "@fxhash/params"

const MAX_BYTES = 50000

export function PanelParams() {
  const { iframe } = useContext(MainContext)
  const runtime = useContext(RuntimeContext)

  const [lockedParamIds, setLockedParamIds] = useState<string[]>([])
  const { history, offset, undo, redo } = useContext(ParamsHistoryContext)

  const bytes = runtime.details.paramsByteSize
  const byteAttention = bytes >= MAX_BYTES / 2

  const handleChangeData: ControlsOnChangeDataHandler = (
    newData,
    changedParam
  ) => {
    runtime.state.update({ params: newData })
    const realtimeSync =
      runtime.definition.params?.find((d: any) => d.id === changedParam?.id)
        ?.update === "sync"
    if (realtimeSync && changedParam) {
      iframe?.contentWindow?.postMessage(
        {
          id: "fxhash_params:update",
          data: {
            params: {
              [changedParam.id]: changedParam.value,
            },
          },
        },
        "*"
      )
    }
  }

  const updateData = useCallback(
    (e: any) => {
      const { params } = e.data.data
      const newData = {
        ...runtime.state.params,
        ...params,
      }
      runtime.state.update({ params: newData })
    },
    [runtime.state.params]
  )

  useMessageListener("fxhash_emit:params:update", updateData)

  const handleRandomizeParams = () => {
    const randomValues = getRandomParamValues(
      runtime.definition.params!.filter((p: FxParamDefinition<FxParamType>) =>
        lockedParamIds ? !lockedParamIds.includes(p.id) : false
      )
    )
    runtime.state.update({
      params: { ...runtime.state.params, ...randomValues },
    })
  }
  const handleToggleLockAllParams = () => {
    if (lockedParamIds.length > 0) {
      setLockedParamIds([])
    } else {
      const allParamIds = runtime.definition.params!.map(
        (d: FxParamDefinition<FxParamType>) => d.id
      )
      setLockedParamIds(allParamIds)
    }
  }
  const handleClickLockButton = (id: string) => {
    if (lockedParamIds.includes(id)) {
      const updatedIds = lockedParamIds.filter((fid) => fid !== id)
      setLockedParamIds(updatedIds)
    } else {
      const updatedIds = [id, ...lockedParamIds]
      setLockedParamIds(updatedIds)
    }
  }
  const handleUndo = () => {
    undo()
  }
  const handleRedo = () => {
    redo()
  }
  const allLocked = useMemo(
    () => lockedParamIds?.length === runtime.definition.params?.length,
    [lockedParamIds?.length, runtime.definition.params?.length]
  )

  const allParamsCodeDriven = useMemo(
    () =>
      runtime.definition.params?.every((p: any) => p.update === "code-driven"),
    [runtime.definition.params]
  )

  if (!runtime.definition.params || runtime.definition.params.length === 0) return null

  return (
    <PanelGroup
      title="Params"
      description={`fx(params) can be defined in your code and are pulled in real time from the code running. ${byteAttention ? `Parameter value space is limited to 50kb.` : ""
        }`}
      descriptionClassName={classes.description}
    >
      {byteAttention && <ProgressBar max={MAX_BYTES} progress={bytes} />}
      <div className={classes.randomContainer}>
        <BaseButton
          color="secondary"
          className={classes.randomButton}
          onClick={handleRandomizeParams}
          disabled={allLocked || allParamsCodeDriven}
        >
          Randomize Params
        </BaseButton>
        <IconButton
          onClick={handleUndo}
          color="secondary"
          disabled={history.length <= 1 || offset === history.length - 1}
        >
          <FontAwesomeIcon icon={faRotateLeft} />
        </IconButton>
        <IconButton
          onClick={handleRedo}
          color="secondary"
          disabled={history.length <= 1 || offset === 0}
        >
          <FontAwesomeIcon icon={faRotateRight} />
        </IconButton>
        <div>
          <LockButton
            title="toggle lock all params"
            isLocked={allLocked}
            onClick={handleToggleLockAllParams}
            className={cx(classes.lockAllButton, {
              [classes.primary]: allLocked,
            })}
          />
        </div>
      </div>
      <div className={classes.controlsWrapper}>
        <Controls
          params={runtime.definition.params}
          onClickLockButton={handleClickLockButton}
          lockedParamIds={lockedParamIds}
          onChangeData={handleChangeData}
          data={runtime.state.params}
        />
      </div>
      {allParamsCodeDriven && (
        <p className={classes.codeDrivenNote}>
          All params of this artwork are defined as "code-driven". This will
          enable a dedicated minting experience for collectors on fxhash.xyz
        </p>
      )}
    </PanelGroup>
  )
}
