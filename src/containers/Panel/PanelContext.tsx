import styles from "./PanelContext.module.scss"
import { useContext, useState } from "react"
import { MainContext } from "context/MainContext"
import { faRotate } from "@fortawesome/free-solid-svg-icons"
import { PanelGroup } from "components/Panel/PanelGroup"
import {
  BaseButton,
  BaseInput,
  BaseSelect,
  IconButton,
} from "components/FxParams/BaseInput"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RuntimeContext, TExecutionContext } from "context/RuntimeContext"
import { CaptureControls } from "components/FxParams/Controls"
import { serializeParams } from "components/FxParams/utils"

const contexts = ["minting", "standalone", "capture"]
const captureParams = [
  {
    id: "resX",
    name: "width",
    type: "number",
    options: {
      min: 256,
      max: 2056,
      step: 1,
    },
    version: "4.0.0",
    default: 800,
    value: 800,
  },
  {
    id: "resY",
    name: "height",
    type: "number",
    options: {
      min: 256,
      max: 2056,
      step: 1,
    },
    version: "4.0.0",
    default: 800,
    value: 800,
  },
  {
    id: "mode",
    name: "capture mode",
    type: "select",
    options: {
      options: ["VIEWPORT", "CANVAS"],
    },
    version: "4.0.0",
    default: "VIEWPORT",
    value: "VIEWPORT",
  },
  {
    id: "trigger",
    name: "trigger by",
    type: "select",
    options: {
      options: ["FN_TRIGGER", "DELAY"],
    },
    version: "4.0.0",
    default: "DELAY",
    value: "DELAY",
  },
  {
    id: "delay",
    name: "delay(s) (DELAY)",
    type: "number",
    options: {
      min: 0,
      max: 60000,
      step: 1,
    },
    version: "4.0.0",
    default: 2000,
    value: 2000,
  },
  {
    id: "selector",
    name: "css selector (CANVAS)",
    type: "string",
    options: {
      minLength: 1,
      maxLength: 256,
    },
    version: "4.0.0",
    default: "canvas",
    value: "canvas",
  },
]

export function PanelContext() {
  const ctx = useContext(MainContext)
  const runtime = useContext(RuntimeContext)

  const [captureConfig, setCaptureConfig] = useState(
    captureParams.reduce(
      (acc, p) => {
        acc[p.id] = p.value
        return acc
      },
      {} as Record<string, any>
    )
  )

  const handleCaptureConfigChange = (newData: Record<string, any>) => {
    setCaptureConfig(newData)
  }
  const handleChange = (context: TExecutionContext) => {
    runtime.state.update({ context })
  }

  return (
    <>
      <PanelGroup
        title="Execution context"
        description="Simulate different contexts in which the code will be executed."
      >
        <div className={styles.hashControls}>
          <BaseSelect
            name="context"
            className={styles.select}
            value={runtime.state.context}
            onChange={(evt) =>
              handleChange(evt.target.value as TExecutionContext)
            }
          >
            {contexts.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </BaseSelect>
        </div>
      </PanelGroup>
      {ctx.devCli && runtime.state.context === "capture" && (
        <PanelGroup
          title="Capture Preview"
          description="Attempt to capture project and preview"
        >
          <CaptureControls
            captureParams={captureParams}
            data={captureConfig}
            onChangeData={handleCaptureConfigChange}
          />
          <BaseButton
            onClick={() => {
              if (!runtime.state.params) return
              const bytes = serializeParams(
                runtime.state.params,
                runtime.definition.params!
              )

              const p = [
                `fxhash=${runtime.state.hash}`,
                `fxminter=${runtime.state.minter}`,
                `fxiteration=${runtime.state.iteration}`,
                `inputBytes=0x${bytes}`,
              ]
              p.push(
                ...Object.keys(captureConfig).map((k) => {
                  return `${k}=${captureConfig[k]}`
                })
              )
              const target = `/preview?${p.join("&")}`
              window.open(target)
            }}
          >
            capture preview
          </BaseButton>
        </PanelGroup>
      )}
    </>
  )
}
