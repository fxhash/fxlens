import { PropsWithChildren, useMemo, useState } from "react"
import { createContext } from "react"
import { sumBytesParams } from "./utils"

export interface IFxParamsContext {
  // params pulled from the <iframe> element
  params: any
  setParams: (params: any) => void
  // params pulled the controls
  data: any
  setData: (params: any) => void
  byteSize: number | null
}

const defaultParamsContext: IFxParamsContext = {
  params: [],
  setParams: () => {},
  data: null,
  setData: () => {},
  byteSize: null,
}

export const FxParamsContext = createContext(defaultParamsContext)

type Props = PropsWithChildren<any>
export function FxParamsProvider({ children }: Props) {
  const [params, setParams] = useState<any>(null)
  const [data, setData] = useState<any>(null)

  const byteSize = useMemo(() => sumBytesParams(params), [params])

  const context: IFxParamsContext = {
    params,
    setParams,
    data,
    setData,
    byteSize,
  }

  return (
    <FxParamsContext.Provider value={context}>
      {children}
    </FxParamsContext.Provider>
  )
}
