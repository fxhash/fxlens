import {
  FxParamDefinition,
  FxParamType,
  FxParamsData,
} from "components/FxParams/types"
import { PropsWithChildren, useMemo, useState } from "react"
import { createContext } from "react"
import sha1 from "sha1"
import { sumBytesParams } from "components/FxParams/utils"

/**
 * The Runtime Context is responsible for managing the state of a project ran
 * in a frame. It centralizes any source of data to derive the project and
 * manipulate it from the outside.
 */

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

function hashRuntimeHardState(
  state: RuntimeState,
  definition: FxParamDefinition<FxParamType>[] | null
) {
  const staticParams: FxParamsData = {}
  for (const id in state.params) {
    const def = definition?.find((def) => def.id === id)
    if (!def || !def.update || def.update === "page-reload") {
      staticParams[id] = state.params[id]
    }
  }
  return hashRuntimeState({
    ...state,
    params: staticParams,
  })
}

export interface IRuntimeContext {
  state: RuntimeState & {
    update: (data: RuntimeStateUpdate) => void
  }
  definition: RuntimeDefinition & {
    update: (data: RuntimeDefinitionUpdate) => void
  }
  details: {
    paramsByteSize: number
    stateHash: {
      soft: string
      hard: string
    }
  }
}

const defaultRuntimeContext: IRuntimeContext = {
  state: {
    hash: "",
    minter: "",
    params: {},
    update: () => {},
  },
  definition: {
    params: null,
    version: null,
    update: () => {},
  },
  details: {
    paramsByteSize: 0,
    stateHash: {
      soft: "",
      hard: "",
    },
  },
}

export const RuntimeContext = createContext(defaultRuntimeContext)

type Props = PropsWithChildren<any>
export function RuntimeProvider({ children }: Props) {
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

  const updateDefinition = (data: RuntimeDefinitionUpdate) => {
    setDefinition({
      ...definition,
      ...data,
    })
  }

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

  const ctx: IRuntimeContext = {
    state: {
      ...state,
      update,
    },
    definition: {
      ...definitionEnhanced,
      update: updateDefinition,
    },
    details: useMemo(
      () => ({
        paramsByteSize: sumBytesParams(definition.params || []),
        stateHash: {
          soft: hashRuntimeState(state),
          hard: hashRuntimeHardState(state, definition.params),
        },
      }),
      [state, definition.params]
    ),
  }

  return (
    <RuntimeContext.Provider value={ctx}>{children}</RuntimeContext.Provider>
  )
}
