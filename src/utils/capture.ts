import html2canvas from "html2canvas"
import { FxHashApi } from '@fxhash/project-sdk'

export const CAPTURE_SIZE = 800

export enum CaptureTrigger {
  ON_LOAD = "on load",
  PROGRAMMATIC = "programmatic preview",
  FIXED_DELAY = "fixed delay"
}

export enum CaptureTarget {
  VIEWPORT = "viewport",
  CANVAS = "canvas"
}

export interface CaptureOptions {
  trigger?: CaptureTrigger;
  target?: CaptureTarget;
  delay?: number;
  selector?: string;
}

interface FxWindow extends Window {
  $fx: FxHashApi;
}

const _imageCache: Record<string, string> = {}

export async function captureURL(url: string, options?: CaptureOptions): Promise<string> {
  if (_imageCache[url]) {
    return _imageCache[url]
  }

  const trigger = options?.trigger || CaptureTrigger.ON_LOAD;
  const target = options?.target || CaptureTarget.VIEWPORT;
  const delay = options?.delay || 0;
  const selector = options?.selector || '';

  return new Promise<string>((resolve, reject) => {
    const iframe = document.createElement("iframe")
    iframe.style.border = "none"
    iframe.style.visibility = "hidden"
    iframe.style.position = "absolute"
    const previewUrl = new URL(url)
    if (trigger === CaptureTrigger.PROGRAMMATIC) {
      previewUrl.searchParams.set("preview", "1")
    }
    iframe.src = previewUrl.toString()
    iframe.style.width = `${CAPTURE_SIZE}px`
    iframe.style.height = `${CAPTURE_SIZE}px`
    iframe.setAttribute("crossorigin", "anonymous")
    iframe.setAttribute("sandbox", "allow-same-origin allow-scripts")

    const timeoutId: number = window.setTimeout(() => {
      cleanup()
      reject(new Error("Capture timed out"))
    }, 20000)

    const cleanup = () => {
      if (iframe.parentNode) {
        document.body.removeChild(iframe)
      }
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }

    const captureContent = async () => {
      try {
        const contentWindow = iframe.contentWindow as FxWindow
        if (!contentWindow) throw new Error("No contentWindow in iframe")

        const iframeDocument = iframe.contentDocument|| contentWindow.document

        // Determine the element to capture based on target option
        let element: HTMLElement;
        if (target === CaptureTarget.CANVAS && selector) {
          const selectedElement = iframeDocument?.querySelector(selector) as HTMLElement;
          if (!selectedElement) throw new Error(`Element with selector "${selector}" not found`);
          element = selectedElement;
        } else {
          // Default to viewport (body)
          element = iframeDocument?.body;
          if (!element) throw new Error("No content found in iframe");
        }

        const canvas = await html2canvas(element, {
          allowTaint: true,
          useCORS: true,
          logging: false,
          scale: 1,
          backgroundColor: "transparent",
        })
        const imageData = canvas.toDataURL("image/png")
        _imageCache[url] = imageData
        cleanup()
        resolve(imageData)
      } catch {
        cleanup()
        reject(new Error(`Cannot capture URL content.`))
      }
    }

    iframe.onload = () => {
      try {
        const contentWindow = iframe.contentWindow as FxWindow
        if (!contentWindow) throw new Error("No contentWindow in iframe")

        contentWindow.$fx.preview = async () => {
          if (trigger === CaptureTrigger.PROGRAMMATIC) {
            await captureContent();
          }
        }

        switch (trigger) {
          case CaptureTrigger.ON_LOAD:
            captureContent();
            break;

          case CaptureTrigger.FIXED_DELAY:
            window.setTimeout(captureContent, delay);
            break;

          case CaptureTrigger.PROGRAMMATIC:
            // Do nothing here, will be triggered by $fx.preview()
            break;
        }
      } catch {
        cleanup()
        reject(new Error(`Failed to set up preview hook.`))
      }
    }

    document.body.appendChild(iframe)
  })
}
