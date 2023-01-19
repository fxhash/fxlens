import { PropsWithChildren, useState } from "react"
import { createContext } from "react"

export interface IFxParamsContext {
  // params pulled from the <iframe> element
  params: any
  setParams: (params: any) => void
  // params pulled the controls
  data: any
  setData: (params: any) => void
}

const defaultParamsContext: IFxParamsContext = {
  params: [],
  setParams: () => {},
  data: null,
  setData: () => {},
}

export const FxParamsContext = createContext(defaultParamsContext)

type Props = PropsWithChildren<{}>
export function FxParamsProvider({ children }: Props) {
  const [params, setParams] = useState<any>(null)
  const [data, setData] = useState<any>(null)

  const context: IFxParamsContext = {
    params,
    setParams,
    data,
    setData,
  }

  return <FxParamsContext.Provider value={context}>{children}</FxParamsContext.Provider>
}
