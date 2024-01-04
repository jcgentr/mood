'use client'

import { askQuestion } from '@/utils/api'
import React, { useState } from 'react'

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
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="border border-gray-300 rounded-md p-2 text-lg"
          disabled={loading}
          placeholder="Ask a question..."
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-blue-400 px-4 py-2 rounded-md"
        >
          Ask
        </button>
      </form>
      {loading ? <div>loading...</div> : <div>{answer}</div>}
    </div>
  )
}
