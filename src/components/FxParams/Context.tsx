import { PropsWithChildren, useMemo, useState } from "react"
import { createContext } from "react"
import { FxParamDefinition, FxParamType } from "./types"
import { sumBytesParams } from "./utils"

export interface IFxParamsContext {
  // params pulled from the <iframe> element
  params: FxParamDefinition<FxParamType>[]
  setParams: (params: FxParamDefinition<FxParamType>[] | null) => void
  // params pulled the controls
  data: any
  setData: (params: any) => void
  byteSize: number | null
  setVersion: (params: string) => void
  version: string | null
}

const defaultParamsContext: IFxParamsContext = {
  params: [],
  setParams: () => {},
  data: null,
  setData: () => {},
  byteSize: null,
  version: null,
  setVersion: () => {},
}

export const FxParamsContext = createContext(defaultParamsContext)

type Props = PropsWithChildren<any>
export function FxParamsProvider({ children }: Props) {
  const [version, setVersion] = useState<string | null>(null)
  const [params, setParams] = useState<any>(null)
  const [data, setData] = useState<any>(null)

  const byteSize = useMemo(() => sumBytesParams(params), [params])

  const paramsWithVersion = useMemo(
    () =>
      params?.map((p: FxParamDefinition<FxParamType>) => ({
        ...p,
        version: version,
      })),
    [params, version]
  )

  const context: IFxParamsContext = {
    params: paramsWithVersion,
    setParams,
    data,
    setData,
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
