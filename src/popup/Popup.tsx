import { MessageList, EmptyMessages } from './components'
import { useMessages } from './context'

export default function Popup() {
  const [{ messages, hasMessages }, { updateMessage }] = useMessages()

  return (
    <div className="popupContainer" style={{ width: 800, height: 800 }}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Messages</h1>
        </div>
        {hasMessages ? (
          <MessageList messages={messages} onUpdateMessage={updateMessage} />
        ) : (
          <EmptyMessages />
        )}
      </div>
    </div>
  )
}
