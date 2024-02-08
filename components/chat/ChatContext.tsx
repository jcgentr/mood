import React, { ReactNode, createContext, useRef, useState } from 'react'
import { useToast } from '../ui/use-toast'
import { useMutation } from '@tanstack/react-query'
import { trpc } from '@/app/_trpc/client'
import { INFINITE_QUERY_LIMIT } from '@/utils/config'

type StreamResponse = {
  addMessage: () => void
  message: string
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  isLoading: boolean
}

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: '',
  handleInputChange: () => {},
  isLoading: false,
})

interface Props {
  journalEntryId: string
  children: ReactNode
}

export const ChatContextProvider = ({ journalEntryId, children }: Props) => {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const utils = trpc.useUtils()
  const backupMsg = useRef('')

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      setIsLoading(true)
      const response = await fetch('/api/message', {
        method: 'POST',
        body: JSON.stringify({ journalEntryId, message }),
      })
      setIsLoading(false)

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      return response.body
    },
    onMutate: async ({ message }) => {
      backupMsg.current = message
      setMessage('')

      // step 1
      await utils.getEntryMessages.cancel()
      // step 2
      const previousMessages = utils.getEntryMessages.getInfiniteData()
      // step 3
      utils.getEntryMessages.setInfiniteData(
        { journalEntryId, limit: INFINITE_QUERY_LIMIT },
        (old) => {
          if (!old) {
            return {
              pages: [],
              pageParams: [],
            }
          }

          let newPages = [...old.pages]
          let latestPage = newPages[0]!

          latestPage.messages = [
            {
              createdAt: new Date().toISOString(),
              id: crypto.randomUUID(),
              text: message,
              isUserMessage: true,
            },
            ...latestPage.messages,
          ]

          newPages[0] = latestPage

          return {
            ...old,
            pages: newPages,
          }
        }
      )

      setIsLoading(true)

      return {
        previousMessages:
          previousMessages?.pages.flatMap((page) => page.messages) ?? [],
      }
    },
    onError: (_e, _v, context) => {
      setMessage(backupMsg.current)
      utils.getEntryMessages.setData(
        { journalEntryId },
        { messages: context?.previousMessages ?? [] }
      )
    },
    onSettled: async () => {
      setIsLoading(false)
      await utils.getEntryMessages.invalidate({ journalEntryId })
    },
    onSuccess: async (stream) => {
      setIsLoading(false)

      if (!stream) {
        return toast({
          title: 'There was a problem sending this message',
          description: 'Please refresh this page and try again',
          variant: 'destructive',
        })
      }

      const reader = stream.getReader()
      const decoder = new TextDecoder()
      let done = false

      // accumulated response
      let accResponse = ''

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        const chunkValue = decoder.decode(value)

        accResponse += chunkValue

        // append chunk to the actual message
        utils.getEntryMessages.setInfiniteData(
          { journalEntryId, limit: INFINITE_QUERY_LIMIT },
          (old) => {
            if (!old) return { pages: [], pageParams: [] }

            let isAiResponseCreated = old.pages.some((page) =>
              page.messages.some((message) => message.id === 'ai-response')
            )

            let updatedPages = old.pages.map((page) => {
              if (page === old.pages[0]) {
                let updatedMessages

                if (!isAiResponseCreated) {
                  updatedMessages = [
                    {
                      createdAt: new Date().toISOString(),
                      id: 'ai-response',
                      text: accResponse,
                      isUserMessage: false,
                    },
                    ...page.messages,
                  ]
                } else {
                  updatedMessages = page.messages.map((message) => {
                    if (message.id === 'ai-response') {
                      return {
                        ...message,
                        text: accResponse,
                      }
                    }
                    return message
                  })
                }

                return {
                  ...page,
                  messages: updatedMessages,
                }
              }

              return page
            })

            return { ...old, pages: updatedPages }
          }
        )
      }
    },
  })

  const addMessage = () => {
    console.log('adding message...')
    sendMessage({ message })
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
    setMessage(event.target.value)

  return (
    <ChatContext.Provider
      value={{ addMessage, message, handleInputChange, isLoading }}
    >
      {children}
    </ChatContext.Provider>
  )
}
