import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import Popup from './Popup'

chrome.tabs.query({ active: true, currentWindow: true }, async () => {
  ReactDOM.createRoot(document.getElementById('popup')!).render(
    <StrictMode>
      <Popup />
    </StrictMode>,
  )
})
