import {
  FxParamDefinition,
  FxParamType,
  FxParamsData,
} from "components/FxParams/types"
import { sumBytesParams } from "components/FxParams/utils"
import { useCallback, useMemo, useState } from "react"
import sha1 from "sha1"

interface RuntimeState {
  hash: string
  minter: string
  params: FxParamsData
}
type RuntimeStateUpdate = Partial<RuntimeState>

interface RuntimeDefinition {
  params: FxParamDefinition<FxParamType>[] | null
  version: string | null
}
export type RuntimeDefinitionUpdate = Partial<RuntimeDefinition>

function hashRuntimeState(state: RuntimeState) {
  return sha1(JSON.stringify(state))
}

function hashRuntimeStaticState(
  state: RuntimeState,
  definition: FxParamDefinition<FxParamType>[] | null
) {
  const staticParams: FxParamsData = {}
  for (const id in state.params) {
    const def = definition?.find((def) => def.id === id)
    if (!def || def?.update === "page-reload") {
      staticParams[id] = state.params[id]
    }
  }
  return hashRuntimeState({
    ...state,
    params: staticParams,
  })
}

export interface IUseRuntimeState extends RuntimeState {
  update: (data: RuntimeStateUpdate) => void
  definition: RuntimeDefinition
  updateDefinition: (data: RuntimeDefinitionUpdate) => void
  details: {
    paramsByteSize: number
    stateHash: {
      soft: string
      hard: string
    }
  }
}

/**
 * The runtime state is a generic-purpose state designed to handle the data
 * required by the runtime of a fxhash project. It provides utilities for other
 * components to more easily store & interact with the state, eventually
 * applying the side-effects of a state update, if any.
 */
export function useRuntimeState(): IUseRuntimeState {
  const [state, setState] = useState<RuntimeState>({
    hash: "",
    minter: "",
    params: {},
  })
  const [definition, setDefinition] = useState<RuntimeDefinition>({
    params: null,
    version: null,
  })

  const update = (data: RuntimeStateUpdate) => {
    setState({
      ...state,
      ...data,
    })
  }

  const updateDefinition = useCallback(
    (data: RuntimeDefinitionUpdate) => {
      setDefinition({
        ...definition,
        ...data,
      })
    },
    [definition]
  )

  const definitionEnhanced = useMemo(
    () => ({
      ...definition,
      params:
        definition.params?.map((p: FxParamDefinition<FxParamType>) => ({
          ...p,
          version: definition.version || "0",
        })) || null,
    }),
    [definition]
  )

  console.log(definition)

  return {
    ...state,
    update,
    definition: definitionEnhanced,
    updateDefinition,
    details: useMemo(
      () => ({
        paramsByteSize: sumBytesParams(definition.params || []),
        stateHash: {
          soft: hashRuntimeState(state),
          hard: hashRuntimeStaticState(state, definition.params),
        },
      }),
      [state, definition.params]
    ),
  }
}
