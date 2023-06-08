import { RefObject, useEffect } from "react"

export function useMessageListener(
  eventId: string,
  listener: (e: any) => void
) {
  useEffect(() => {
    const _listener = (e: any) => {
      if (e.data.id === eventId) listener(e)
    }

    window.addEventListener("message", _listener, false)

    return () => {
      window.removeEventListener("message", _listener, false)
    }
  }, [listener])
}

export function usePostMessageListener(
  iframe: RefObject<HTMLIFrameElement>,
  eventId: string,
  listener: (e: any) => void
) {
  useMessageListener(eventId, listener)
  useEffect(() => {
    if (!iframe.current) return
    iframe.current.addEventListener("load", () => {
      iframe.current?.contentWindow?.postMessage(eventId, "*")
    })
  }, [iframe, eventId])
}
