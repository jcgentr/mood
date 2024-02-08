import { ChatContextProvider } from './ChatContext'
import ChatInput from './ChatInput'
import Messages from './Messages'

interface Props {
  journalEntryId: string
}

export default function ChatWrapper({ journalEntryId }: Props) {
  return (
    <ChatContextProvider journalEntryId={journalEntryId}>
      <div className="relative mt-2 flex-1 bg-zinc-50 flex flex-col justify-between gap-2 divide-y divide-zinc-200">
        <div className="flex-1 justify-between flex flex-col">
          <Messages journalEntryId={journalEntryId} />
        </div>
        <ChatInput />
      </div>
    </ChatContextProvider>
  )
}
