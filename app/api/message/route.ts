import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { SendMessageValidator } from '@/utils/validators/SendMessageValidator'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Document } from 'langchain/document'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { NextRequest } from 'next/server'
import OpenAI from 'openai'

export const POST = async (req: NextRequest) => {
  const body = await req.json()
  const user = await getUserByClerkID()
  const { journalEntryId, message } = SendMessageValidator.parse(body)

  const journalEntry = await prisma.journalEntry.findFirst({
    where: {
      id: journalEntryId,
      userId: user.id,
    },
  })

  if (!journalEntry)
    return new Response('Journal entry not found', { status: 404 })

  await prisma.message.create({
    data: {
      text: message,
      isUserMessage: true,
      journalEntryId,
      userId: user.id,
    },
  })

  const doc = new Document({
    pageContent: journalEntry.content,
    metadata: { source: journalEntry.id, date: journalEntry.createdAt },
  })
  const embeddings = new OpenAIEmbeddings()
  const vectorStore = await MemoryVectorStore.fromDocuments([doc], embeddings)

  const results = await vectorStore.similaritySearch(message, 4)

  const prevMessages = await prisma.message.findMany({
    where: {
      journalEntryId,
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: 6,
  })
  const formattedPrevMessages = prevMessages.map((msg) => ({
    role: msg.isUserMessage ? 'user' : 'assistant',
    content: msg.text,
  }))

  const model = new OpenAI()
  const response = await model.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    stream: true,
    messages: [
      {
        role: 'system',
        content:
          'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
      },
      {
        role: 'user',
        content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
  \n----------------\n
  
  PREVIOUS CONVERSATION:
  ${formattedPrevMessages.map((message) => {
    if (message.role === 'user') return `User: ${message.content}\n`
    return `Assistant: ${message.content}\n`
  })}
  
  \n----------------\n
  
  CONTEXT:
  ${results.map((r) => r.pageContent).join('\n\n')}
  
  USER INPUT: ${message}`,
      },
    ],
  })

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await prisma.message.create({
        data: {
          text: completion,
          isUserMessage: false,
          journalEntryId,
          userId: user.id,
        },
      })
    },
  })

  console.log('message received, now streaming...')

  return new StreamingTextResponse(stream)
}
