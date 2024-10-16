import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import Messages from '../lib/Messages'
import WithErrorBoundary from './WithErrorBoundary'
import MessagesProvider from './context/MessagesProvider'

import Popup from './Popup'

import '../styles.css'

chrome.tabs.query({ active: true, currentWindow: true }, async () => {
  const messages = await Messages.get()

  ReactDOM.createRoot(document.getElementById('popup')!).render(
    <StrictMode>
      <WithErrorBoundary>
        <MessagesProvider messages={messages}>
          <Popup />
        </MessagesProvider>
      </WithErrorBoundary>
    </StrictMode>,
  )
})
