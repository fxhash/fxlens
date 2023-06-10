import { PropsWithChildren, useMemo, useState } from "react"
import { createContext } from "react"
import { FxParamDefinition, FxParamType, FxParamsData } from "./types"
import { sumBytesParams } from "./utils"

export interface IFxParamsContext {
  // definition pulled from the <iframe> element
  definition: FxParamDefinition<FxParamType>[]
  setDefinition: (definition: FxParamDefinition<FxParamType>[] | null) => void
  // params pulled the controls
  paramValues: FxParamsData
  setParamValues: (params: FxParamsData) => void
  byteSize: number | null
  setVersion: (params: string) => void
  version: string | null
}

const defaultParamsContext: IFxParamsContext = {
  definition: [],
  setDefinition: () => {},
  paramValues: {},
  setParamValues: () => {},
  byteSize: null,
  version: null,
  setVersion: () => {},
}

export const FxParamsContext = createContext(defaultParamsContext)

type Props = PropsWithChildren<any>
export function FxParamsProvider({ children }: Props) {
  const [version, setVersion] = useState<string | null>(null)
  const [definition, setDefinition] = useState<any>(null)
  const [paramValues, setParamValues] = useState<any>(null)

  const byteSize = useMemo(() => sumBytesParams(definition), [definition])

  const definitionWithVersion = useMemo(
    () =>
      definition?.map((p: FxParamDefinition<FxParamType>) => ({
        ...p,
        version: version,
      })),
    [definition, version]
  )

  const context: IFxParamsContext = {
    definition: definitionWithVersion,
    setDefinition,
    paramValues,
    setParamValues,
    byteSize,
    version,
    setVersion,
  }

  return (
    <FxParamsContext.Provider value={context}>
      {children}
    </FxParamsContext.Provider>
  )
}
