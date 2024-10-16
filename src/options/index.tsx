import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import Options from './Options'

chrome.tabs.query({ active: true, currentWindow: true }, async () => {
  ReactDOM.createRoot(document.getElementById('options')!).render(
    <StrictMode>
      <Options />
    </StrictMode>,
  )
})
