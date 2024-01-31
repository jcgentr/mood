'use client'

import { askQuestion } from '@/utils/api'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

export default function Question() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const answer = await askQuestion(question)
    setAnswer(answer)
    setQuestion('')
    setLoading(false)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex max-w-xl gap-1">
          <Input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-lg"
            disabled={loading}
            placeholder="Ask a question..."
          />
          <Button disabled={loading} type="submit">
            Ask
          </Button>
        </div>
      </form>
      {loading ? <div>loading...</div> : <div>{answer}</div>}
    </div>
  )
}
