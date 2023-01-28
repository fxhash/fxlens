import React from "react"
import ReactDOM from "react-dom/client"
import "./styles/globals.scss"
import { Root } from "containers/Root"
import { App } from "containers/App"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <Root>
      <App />
    </Root>
  </React.StrictMode>
)
