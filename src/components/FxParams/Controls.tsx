import React, { createRef, useEffect, useMemo, useState } from "react"
import { consolidateParams } from "components/FxParams/utils"
import { ParameterController } from "./Controller/Param"
import { LockButton } from "./LockButton/LockButton"
import classes from "./Controls.module.scss"
import { validateParameterDefinition } from "./validation"
import { stringifyParamsData } from "./utils"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons"
import { FxParamType, FxParamTypeMap } from "./types"

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
          onClick={() => onClickLockButton(parameter.id)}
        />
      )}
    </div>
  )
}

export type ControlsOnChangeDataHandler = (
  newData: Record<string, any>,
  changedParam?: {
    id: string
    value: FxParamTypeMap[FxParamType]
  }
) => void

interface ControlsProps {
  params: any
  onClickLockButton?: (id: string) => void
  lockedParamIds?: string[]
  onChangeData: ControlsOnChangeDataHandler
  data: Record<string, any>
}

export const Controls = ({
  params,
  data,
  onClickLockButton,
  lockedParamIds,
  onChangeData,
}: ControlsProps) => {
  const consolidatedParams = consolidateParams(params, data)
  const p: React.RefObject<HTMLDivElement> = createRef()
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({})

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }))
  }

  useEffect(() => {
    const ps: any = {}
    if (consolidatedParams?.length > 0) {
      consolidatedParams.forEach((param: any) => {
        ps[param.id] = param.value
      })
      if (stringifyParamsData(data) !== stringifyParamsData(ps)) {
        onChangeData(ps)
      }
    }
  }, [params, data, onChangeData])

  const handleChangeParam = (id: string, value: any) => {
    const newData = { ...data, [id]: value }
    onChangeData(newData, { id, value })
  }

  const groupByGroup = (params: any[]) => {
    return params.reduce((acc: { [key: string]: any[] }, param: any) => {
      const groupName = param.group || "" // To-do: Maybe used "Other" as default group name? Nice when there are other groups but meaningless when no params have "group"
      if (!acc[groupName]) {
        acc[groupName] = []
      }
      acc[groupName].push(param)
      return acc
    }, {})
  }

  const groupedParams = useMemo(
    () => groupByGroup(consolidatedParams),
    [consolidatedParams]
  )

  const sortedGroupNames = useMemo(() => {
    return Object.keys(groupedParams)
    // To-do: decide if we want to sort A-Z or not. If so, we need to make sure "Other" is always last
    // By now I'm leaving the order as it comes from the $fx.params() call so that the user is able to define its own custom sort order
    return Object.keys(groupedParams).sort((a, b) => {
      if (a === "Other") return 1
      if (b === "Other") return -1
      return a.localeCompare(b)
    })
  }, [groupedParams])

  return (
    <div className={classes.controls} ref={p}>
      {sortedGroupNames.map((groupName) => {
        const isCollapsed = collapsedGroups[groupName]
        return (
          <div key={groupName} className={classes.group}>
            <h3
              onClick={() => toggleGroup(groupName)}
              style={{
                cursor: "pointer",
                userSelect: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon
                icon={isCollapsed ? faChevronRight : faChevronDown}
              />
              <span style={{ marginLeft: "0.5em" }}>{groupName}</span>
            </h3>
            {!isCollapsed &&
              groupedParams[groupName].map((param: any) => (
                <ControllerBlade
                  key={param.id}
                  parameter={param}
                  onChangeParam={handleChangeParam}
                  lockedParamIds={lockedParamIds}
                  onClickLockButton={onClickLockButton}
                />
              ))}
          </div>
        )
      })}
    </div>
  )
}
