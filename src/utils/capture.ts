import html2canvas from "html2canvas"

export type TriggerMode = "DELAY" | "FN_TRIGGER"

export interface CaptureIframeOptions {
  url: string
  selector?: string
  triggerMode?: TriggerMode
  delay?: number
  width?: number
  height?: number
  eventName?: string
  backgroundColor?: string
}

const _imageCache: Record<string, string> = {}

export async function captureIframe(
  options: CaptureIframeOptions
): Promise<string> {
  const {
    url,
    selector,
    triggerMode = "DELAY",
    delay = 1000,
    width = 800,
    height = 800,
    eventName = "fxhash-preview",
    backgroundColor = "transparent",
  } = options

  const cacheKey = selector ? `${url}|${selector}` : url
  if (_imageCache[cacheKey]) {
    return _imageCache[cacheKey]
  }

  const iframe = document.createElement("iframe")
  iframe.style.border = "none"
  iframe.style.visibility = "hidden"
  iframe.style.position = "absolute"
  iframe.style.width = `${width}px`
  iframe.style.height = `${height}px`
  iframe.src = url
  iframe.setAttribute("crossorigin", "anonymous")
  iframe.setAttribute("sandbox", "allow-same-origin allow-scripts")

  document.body.appendChild(iframe)

  function waitForCapture(iframeWin: Window): Promise<void> {
    if (triggerMode === "DELAY") {
      return new Promise((res) => setTimeout(res, delay))
    }
    if (triggerMode === "FN_TRIGGER") {
      return new Promise((res) => {
        const handler = () => {
          res()
          iframeWin.removeEventListener(eventName, handler as EventListener)
        }
        iframeWin.addEventListener(eventName, handler as EventListener)
      })
    }
    return new Promise((res) => setTimeout(res, 1000))
  }

  return new Promise<string>((resolve, reject) => {
    iframe.onload = async () => {
      try {
        const iframeWin = iframe.contentWindow
        const iframeDoc = iframe.contentDocument || iframeWin?.document
        if (!iframeWin || !iframeDoc)
          throw new Error("No content found in iframe")

        await waitForCapture(iframeWin)

        const target = selector
          ? iframeDoc.querySelector(selector)
          : iframeDoc.body
        if (!target) {
          document.body.removeChild(iframe)
          return reject(
            new Error(`Selector "${selector}" not found in iframe document`)
          )
        }

        const canvas = await html2canvas(target as HTMLElement, {
          allowTaint: true,
          useCORS: true,
          logging: false,
          scale: 1,
          backgroundColor,
        })
        const imageData = canvas.toDataURL("image/png")
        document.body.removeChild(iframe)
        _imageCache[cacheKey] = imageData
        resolve(imageData)
      } catch (err) {
        document.body.removeChild(iframe)
        reject(err)
      }
    }
    iframe.onerror = () => {
      document.body.removeChild(iframe)
      reject(new Error("Failed to load iframe"))
    }
  })
}
