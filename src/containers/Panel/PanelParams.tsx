import {
  Controls,
  ControlsOnChangeDataHandler,
} from "components/FxParams/Controls"
import { PanelGroup } from "components/Panel/PanelGroup"
import { useCallback, useContext, useMemo } from "react"
import { FxParamsContext } from "components/FxParams/Context"
import { ProgressBar } from "components/ProgressBar/ProgressBar"
import { BaseButton, IconButton } from "components/FxParams/BaseInput"
import classes from "./PanelParams.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRotateLeft, faRotateRight } from "@fortawesome/free-solid-svg-icons"
import {
  getRandomParamValues,
  serializeParams,
} from "components/FxParams/utils"
import { FxParamDefinition, FxParamType } from "components/FxParams/types"
import { ParamsHistoryContext } from "components/FxParams/ParamsHistory"
import { LockButton } from "components/FxParams/LockButton/LockButton"
import cx from "classnames"
import { useState } from "react"
import { MainContext } from "context/MainContext"
import { createIframeUrl } from "utils/url"
import { useMessageListener } from "components/FxParams/hooks"

const MAX_BYTES = 50000

export function PanelParams() {
  const { iframe, hash, minter, baseUrl } = useContext(MainContext)
  const { byteSize, params, setData, data } = useContext(FxParamsContext)
  const [lockedParamIds, setLockedParamIds] = useState<string[]>([])
  const { history, offset, undo, redo } = useContext(ParamsHistoryContext)

  const bytes = byteSize || 0
  const byteAttention = bytes >= MAX_BYTES / 2

  const handleChangeData: ControlsOnChangeDataHandler = (
    newData,
    changedParam
  ) => {
    setData(newData)
    const realtimeSync =
      params.find((d) => d.id === changedParam?.id)?.mode === "sync"
    if (realtimeSync) {
      iframe?.contentWindow?.postMessage(
        {
          id: "fxhash_updateParams",
          data: {
            bytes: serializeParams(newData, params || []),
            id: changedParam?.id,
            value: changedParam?.value,
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
        ...data,
        ...params,
      }
      setData(newData)
    },
    [data]
  )

  useMessageListener("fxhash_syncParams", updateData)

  const handleRandomizeParams = () => {
    const randomValues = getRandomParamValues(
      params?.filter((p: FxParamDefinition<FxParamType>) =>
        lockedParamIds ? !lockedParamIds.includes(p.id) : false
      )
    )
    setData({ ...data, ...randomValues })
  }
  const handleToggleLockAllParams = () => {
    if (lockedParamIds.length > 0) {
      setLockedParamIds([])
    } else {
      const allParamIds = params.map(
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
    () => lockedParamIds?.length === params?.length,
    [lockedParamIds?.length, params?.length]
  )

  return (
    <PanelGroup
      title="Params"
      description={`fx(params) can be defined in your code and are pulled in real time from the code running. ${
        byteAttention ? `Parameter value space is limited to 50kb.` : ""
      }`}
      descriptionClassName={classes.description}
    >
      {byteAttention && <ProgressBar max={MAX_BYTES} progress={bytes} />}
      <div className={classes.randomContainer}>
        <BaseButton
          color="secondary"
          className={classes.randomButton}
          onClick={handleRandomizeParams}
          disabled={allLocked}
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
          params={params}
          onClickLockButton={handleClickLockButton}
          lockedParamIds={lockedParamIds}
          onChangeData={handleChangeData}
          data={data}
        />
      </div>
    </PanelGroup>
  )
}
