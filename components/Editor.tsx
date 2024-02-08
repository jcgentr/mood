'use client'

import { updateEntry } from '@/utils/api'
import { useState } from 'react'
import { useAutosave } from 'react-autosave'
import { Textarea } from './ui/textarea'
import ChatWrapper from './chat/ChatWrapper'

export default function Editor({ entry }: { entry: any }) {
  const [value, setValue] = useState(entry.content)
  const [analysis, setAnalysis] = useState(entry.analysis)
  const [isAutosaving, setIsAutosaving] = useState(false)

  const { summary, subject, mood, negative, color } = analysis
  const analysisData = [
    { name: 'Summary', value: summary },
    { name: 'Subject', value: subject },
    { name: 'Mood', value: mood },
    { name: 'Negative', value: negative.toString() },
  ]

  useAutosave({
    data: value,
    onSave: async (_value) => {
      if (_value === entry.content) return
      setIsAutosaving(true)
      const updatedEntry = await updateEntry(entry.id, _value)
      console.log({ updatedEntry })
      setAnalysis(updatedEntry.analysis)
      setIsAutosaving(false)
    },
  })

  return (
    <div className="h-full">
      <div className={isAutosaving ? 'visible' : 'invisible'}>
        Autosaving...
      </div>
      <div className="h-full grid grid-cols-3">
        <div className="col-span-2">
          <Textarea
            className="w-full h-full p-8 text-xl resize-none"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <div className="px-2 h-full flex flex-col">
          <div
            className="rounded px-6 py-10"
            style={{ backgroundColor: color }}
          >
            <h2 className="text-2xl">Analysis</h2>
          </div>
          <div>
            <ul>
              {analysisData.map((item) => (
                <li
                  key={item.name}
                  className="px-2 py-4 flex items-center justify-between"
                >
                  <span className="text-lg font-semibold">{item.name}</span>
                  <span>{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
          <ChatWrapper journalEntryId={entry.id} />
        </div>
      </div>
    </div>
  )
}
