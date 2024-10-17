import { MessageList, EmptyMessages, SortControl } from './components'
import { useMessages } from './context'

export default function Popup() {
  const [state, actions] = useMessages()

  return (
    <div className="popupContainer" style={{ width: 800, height: 800 }}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">
            Messages (Unread: {state.numUnreadMessages})
          </h1>
          {state.hasMessages && (
            <SortControl
              sortBy={state.sortBy}
              onSortMessages={actions.sort}
              hasUnreadMessages={state.numUnreadMessages > 0}
            />
          )}
        </div>
        {state.error && <div className="text-red-500">{state.error}</div>}
        {state.hasMessages ? (
          <MessageList
            messages={state.messages}
            onUpdateMessage={actions.update}
          />
        ) : (
          <EmptyMessages />
        )}
      </div>
    </div>
  )
}
