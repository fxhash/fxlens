import {
  FxParamDefinition,
  FxParamType,
  FxParamsData,
} from "components/FxParams/types"
import { PropsWithChildren, useMemo, useState } from "react"
import { createContext } from "react"
import sha1 from "sha1"
import { jsonStringifyBigint, sumBytesParams } from "components/FxParams/utils"
import { TUpdateStateFn, TUpdateableState } from "types/utils"

/**
 * The Runtime Context is responsible for managing the state of a project ran
 * in a frame. It centralizes any source of data to derive the project and
 * facilitate their manipulation from the outside.
 *
 * See comments on IRuntimeContext for more details.
 */

export interface RuntimeState {
  hash: string
  minter: string
  params: FxParamsData
  iteration: number
}

export interface RuntimeDefinition {
  params: FxParamDefinition<FxParamType>[] | null
  version: string | null
}

/**
 * Hashes a runtime state using sha1
 */
function hashRuntimeState(state: RuntimeState) {
  return sha1(jsonStringifyBigint(state))
}

/**
 * Hashes the hard-refresh properties of a runtime state:
 * - hash
 * - minter address
 * - params in update mode "page-reload"
 */
function hashRuntimeHardState(
  state: RuntimeState,
  definition: FxParamDefinition<FxParamType>[] | null
) {
  const staticParams: FxParamsData = {}
  for (const id in state.params) {
    const def = definition?.find((def) => def.id === id)
    // if no definition, or update == "page-reload" (which is default value)
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
  // the base state of the runtime
  state: TUpdateableState<RuntimeState>
  // definitions, used to manipulate the state
  definition: TUpdateableState<RuntimeDefinition>
  // extra details derived from the state & definition
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
    iteration: 1,
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
    iteration: 1,
  })
  const [definition, setDefinition] = useState<RuntimeDefinition>({
    params: null,
    version: null,
  })

  const update: TUpdateStateFn<RuntimeState> = (data) => {
    setState({
      ...state,
      ...data,
    })
  }

  const updateDefinition: TUpdateStateFn<RuntimeDefinition> = (data) => {
    setDefinition({
      ...definition,
      ...data,
    })
  }

  // enhance each param definition with the version (useful for serialization)
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
