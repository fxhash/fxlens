import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import { Root } from 'containers/Root'
import { App } from 'containers/App'

// allows this document to interact directly with the <iframe> even if not
// under the same port
document.domain = "localhost"

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <React.StrictMode>
    <Root>
      <App/>
    </Root>
  </React.StrictMode>
)