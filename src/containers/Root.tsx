import { MainProvider } from "@/context/MainContext"
import { ParamsHistoryProvider } from "@/components/FxParams/ParamsHistory"
import { PropsWithChildren } from "react"
import { RuntimeProvider } from "@/context/RuntimeContext"
import { OpenFormProvider } from "@/context/OpenFormContext"
import { captureIframe } from "@/utils/capture"
import { ImageLoaderProvider } from "@/context/ImageLoader"

/**
 * The root component is the first one called by the index. It serves as a
 * wrapper over the App to provide context Providers to the rest of the
 * application so that everything underneath is exposed properly.
 */
type Props = PropsWithChildren<any>
export function Root({ children }: Props) {
  return (
    <MainProvider>
      <OpenFormProvider>
        <ImageLoaderProvider maxConcurrent={1} defaultLoader={captureIframe}>
          <RuntimeProvider>
            <ParamsHistoryProvider>{children}</ParamsHistoryProvider>
          </RuntimeProvider>
        </ImageLoaderProvider>
      </OpenFormProvider>
    </MainProvider>
  )
}
