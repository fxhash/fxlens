import React from "react"
import ReactDOM from "react-dom/client"
import { Root } from "@/containers/Root"
import { App } from "@/containers/App"
import "./styles/globals.scss"
import "@fortawesome/fontawesome-svg-core/styles.css"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <Root>
      <App />
    </Root>
  </React.StrictMode>
)
