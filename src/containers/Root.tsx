import { FxParamsProvider } from "components/FxParams/Context"
import { MainProvider } from "context/MainContext"
import { PropsWithChildren } from "react"

/**
 * The root component is the first one called by the index. It serves as a
 * wrapper over the App to provide context Providers to the rest of the
 * application so that everything underneath is exposed properly.
 */
type Props = PropsWithChildren<any>
export function Root({ children }: Props) {
  return (
    <FxParamsProvider>
      <MainProvider>{children}</MainProvider>
    </FxParamsProvider>
  )
}
