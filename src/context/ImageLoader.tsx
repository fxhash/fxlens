import { CaptureIframeOptions, TriggerMode } from "@/utils/capture"
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
  useMemo,
  Dispatch,
} from "react"

type QueueItem = {
  id: string
  url: string
  load: () => Promise<void>
  priority?: number
}

type ImageState = {
  isLoading: boolean
  src?: string
  error?: Error
  lastUpdated: number
  url?: string
}

type ImageStates = Record<string, ImageState>

export type CaptureTarget = "VIEWPORT" | "SELECTOR"
export type PreviewSize = "xs" | "sm" | "lg"

interface ImageLoaderContextType {
  enqueueImage: (
    id: string,
    url: string,
    loadFn?: (options: CaptureIframeOptions) => Promise<string>,
    priority?: number
  ) => void
  dequeueImage: (id: string) => void
  reloadImage: (id: string) => void
  getImageState: (id: string) => ImageState | undefined
  imageStates: ImageStates
  debug: boolean
  setDebug: (value: boolean) => void

  triggerMode: TriggerMode
  setTriggerMode: Dispatch<TriggerMode>
  triggerDelay: number
  setTriggerDelay: Dispatch<number>
  captureTarget: CaptureTarget
  setCaptureTarget: Dispatch<CaptureTarget>
  width: number
  setWidth: Dispatch<number>
  height: number
  setHeight: Dispatch<number>
  cssSelector: string
  setCssSelector: Dispatch<string>
  previewSize: PreviewSize
  setPreviewSize: Dispatch<PreviewSize>
  fastCapture: boolean
  setFastCapture: Dispatch<boolean>
}

const defaultContext: ImageLoaderContextType = {
  enqueueImage: () => {},
  dequeueImage: () => {},
  reloadImage: () => {},
  getImageState: () => undefined,
  imageStates: {},
  debug: false,
  setDebug: () => {},
  triggerMode: "DELAY",
  setTriggerMode: () => {},
  triggerDelay: 1000,
  setTriggerDelay: () => {},
  captureTarget: "VIEWPORT",
  setCaptureTarget: () => {},
  width: 800,
  height: 800,
  setWidth: () => {},
  setHeight: () => {},
  cssSelector: "",
  setCssSelector: () => {},
  previewSize: "sm",
  setPreviewSize: () => {},
  fastCapture: false,
  setFastCapture: () => {},
}

export const ImageLoaderContext =
  createContext<ImageLoaderContextType>(defaultContext)

interface ImageLoaderProviderProps {
  children: ReactNode
  maxConcurrent?: number
  defaultLoader?: (options: CaptureIframeOptions) => Promise<string>
  debug?: boolean
}

export const ImageLoaderProvider: React.FC<ImageLoaderProviderProps> = ({
  children,
  maxConcurrent = 3,
  defaultLoader,
  debug: initialDebug = false,
}) => {
  const [fastCapture, setFastCapture] = useState(false)
  const [previewSize, setPreviewSize] = useState<PreviewSize>("sm")
  const [cssSelector, setCssSelector] = useState("")
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(800)
  const [captureTarget, setCaptureTarget] = useState<CaptureTarget>("VIEWPORT")
  const [triggerMode, setTriggerMode] = useState<TriggerMode>("DELAY")
  const [triggerDelay, setTriggerDelay] = useState(1000)
  const [imageStates, setImageStates] = useState<ImageStates>({})
  const [debug, setDebug] = useState(initialDebug)

  const queueRef = useRef<QueueItem[]>([])
  const processingRef = useRef<boolean>(false)
  const currentLoadingRef = useRef<number>(0)
  const loadersRef = useRef<
    Record<string, (options: CaptureIframeOptions) => Promise<string>>
  >({})

  const log = useCallback(
    (...args: any[]) => {
      if (debug) {
        console.log(...args)
      }
    },
    [debug]
  )

  useEffect(() => {
    if (defaultLoader) {
      loadersRef.current._default = defaultLoader
    }
  }, [defaultLoader])

  const updateImageState = useCallback(
    (id: string, update: Partial<ImageState>) => {
      setImageStates((prev) => {
        const newState = {
          ...prev,
          [id]: {
            ...(prev[id] || { isLoading: false, lastUpdated: Date.now() }),
            ...update,
            lastUpdated: Date.now(),
          },
        }
        return newState
      })
    },
    []
  )

  const processQueue = useCallback(async () => {
    if (processingRef.current) {
      log("Queue already processing, skipping")
      return
    }

    processingRef.current = true
    log(`Processing queue with ${queueRef.current.length} items`)

    queueRef.current.sort((a, b) => (b.priority || 0) - (a.priority || 0))

    while (
      queueRef.current.length > 0 &&
      currentLoadingRef.current < maxConcurrent
    ) {
      const item = queueRef.current.shift()
      if (item) {
        currentLoadingRef.current++
        log(
          `Loading image ${item.id} from ${item.url}, current loading: ${currentLoadingRef.current}`
        )

        try {
          await item.load()
          log(`Successfully loaded image ${item.id}`)
        } catch (error) {
          console.error(
            `Error loading image ${item.id} from ${item.url}:`,
            error
          )
        } finally {
          currentLoadingRef.current--
          log(
            `Finished loading image ${item.id}, current loading: ${currentLoadingRef.current}`
          )
        }
      }
    }

    processingRef.current = false

    if (
      queueRef.current.length > 0 &&
      currentLoadingRef.current < maxConcurrent
    ) {
      log(
        `Queue still has ${queueRef.current.length} items, continuing processing`
      )
      processQueue()
    } else {
      log("Queue empty or max concurrent reached, stopping processing")
    }
  }, [maxConcurrent, log])

  const enqueueImage = useCallback(
    (
      id: string,
      url: string,
      loadFn?: (options: CaptureIframeOptions) => Promise<string>,
      priority = 0
    ) => {
      if (!url) {
        log(`No URL provided for image ${id}, skipping`)
        return
      }

      log(`Enqueueing image ${id} with URL ${url}`)

      if (loadFn) {
        loadersRef.current[id] = loadFn
      }

      const existingState = imageStates[id]

      if (
        existingState?.src &&
        existingState.url === url &&
        !existingState.error
      ) {
        log(`Image ${id} already loaded with URL ${url}, skipping`)
        return
      }
      const isInQueue = queueRef.current.some(
        (item) => item.id === id && item.url === url
      )

      if (isInQueue) {
        log(`Image ${id} already in queue, skipping`)
        return
      }

      updateImageState(id, { isLoading: true, url })

      const load = async () => {
        try {
          log(`Executing load function for image ${id}`)

          const loader =
            loadFn || loadersRef.current[id] || loadersRef.current._default

          log(`Starting loader for image ${id}, ${triggerMode}`)
          const imageSrc = await loader({
            url,
            triggerMode,
            width,
            height,
            delay: triggerDelay,
            selector: captureTarget === "SELECTOR" ? cssSelector : undefined,
          })
          log(`Got image source for ${id}: ${imageSrc.substring(0, 30)}...`)

          updateImageState(id, {
            src: imageSrc,
            isLoading: false,
            error: undefined,
            url,
          })
        } catch (error) {
          console.error(`Error loading image ${id}:`, error)
          updateImageState(id, {
            isLoading: false,
            error: error instanceof Error ? error : new Error(String(error)),
            url,
          })
        }
      }

      queueRef.current.push({ id, url, load, priority })
      log(`Added image ${id} to queue. Queue size: ${queueRef.current.length}`)

      processQueue()
    },
    [
      imageStates,
      processQueue,
      updateImageState,
      log,
      triggerMode,
      triggerDelay,
      width,
      height,
      captureTarget,
      cssSelector,
    ]
  )

  const dequeueImage = useCallback(
    (id: string) => {
      const beforeLength = queueRef.current.length
      queueRef.current = queueRef.current.filter((item) => item.id !== id)
      log(
        `Removed image ${id} from queue. Queue size changed from ${beforeLength} to ${queueRef.current.length}`
      )
    },
    [log]
  )

  const reloadImage = useCallback(
    (id: string) => {
      const state = imageStates[id]
      if (!state) {
        log(`Cannot reload image ${id}, no state found`)
        return
      }

      log(`Reloading image ${id}`)

      dequeueImage(id)

      const url = state.url
      if (url) {
        enqueueImage(id, url, loadersRef.current[id])
      } else {
        log(`Cannot reload image ${id}, no URL found in state`)
      }
    },
    [imageStates, dequeueImage, enqueueImage, log]
  )

  const getImageState = useCallback(
    (id: string) => {
      return imageStates[id]
    },
    [imageStates]
  )

  const contextValue = useMemo(
    () => ({
      enqueueImage,
      dequeueImage,
      reloadImage,
      getImageState,
      imageStates,
      debug,
      setDebug,
      triggerMode,
      setTriggerMode,
      triggerDelay,
      setTriggerDelay,
      captureTarget,
      setCaptureTarget,
      width,
      setWidth,
      height,
      setHeight,
      cssSelector,
      setCssSelector,
      previewSize,
      setPreviewSize,
      fastCapture,
      setFastCapture,
    }),
    [
      enqueueImage,
      dequeueImage,
      reloadImage,
      getImageState,
      imageStates,
      debug,
      setDebug,
      triggerMode,
      setTriggerMode,
      triggerDelay,
      setTriggerDelay,
      captureTarget,
      setCaptureTarget,
      width,
      setWidth,
      height,
      setHeight,
      cssSelector,
      setCssSelector,
      previewSize,
      setPreviewSize,
      fastCapture,
      setFastCapture,
    ]
  )

  return (
    <ImageLoaderContext.Provider value={contextValue}>
      {children}
    </ImageLoaderContext.Provider>
  )
}

export function useImageLoader(
  id: string,
  url?: string,
  loadFn?: (options: CaptureIframeOptions) => Promise<string>,
  priority = 0
) {
  const { enqueueImage, dequeueImage, getImageState, debug } =
    useContext(ImageLoaderContext)

  const contextState = getImageState(id)

  const log = useCallback(
    (...args: any[]) => {
      if (debug) {
        console.log(`[${id}]`, ...args)
      }
    },
    [debug, id]
  )

  useEffect(() => {
    if (url) {
      log(`URL changed to ${url}, loading image`)
      enqueueImage(id, url, loadFn, priority)
    }

    return () => {
      dequeueImage(id)
    }
  }, [id, url])

  const reload = useCallback(() => {
    log("Manual reload triggered")
    if (url) {
      enqueueImage(id, url, loadFn, priority)
    }
  }, [enqueueImage, id, url, loadFn, priority, log])

  return {
    imageSrc: contextState?.src,
    isLoading: contextState?.isLoading || false,
    error: contextState?.error,
    reload,
  }
}

export const ImageLoaderConsumer = ImageLoaderContext.Consumer
