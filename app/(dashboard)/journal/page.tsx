'use client'

import { trpc } from '@/app/_trpc/client'
import EntryCard from '@/components/EntryCard'
import NewEntryButton from '@/components/NewEntryButton'
import Question from '@/components/Question'
import { Ghost } from 'lucide-react'
import Skeleton from 'react-loading-skeleton'

export default function JournalPage() {
  const { data: entries, isLoading } = trpc.getUserEntries.useQuery()

  const renderEntries = () => {
    if (isLoading) {
      return <Skeleton height={144} className="my-2" count={3} />
    }

    if (entries && entries.length > 0) {
      return (
        <ol className="flex flex-col gap-2 mt-4">
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </ol>
      )
    }
    // no entries yet
    return (
      <div className="mt-16 flex flex-col items-center gap-2">
        <Ghost className="h-8 w-8 text-zinc-800" />
        <h3 className="font-semibold text-xl">Pretty empty around here</h3>
        <p>Let&apos;s create your first journal entry.</p>
      </div>
    )
  }

  return (
    <main className="p-10 bg-zinc-400/10">
      <h2 className="text-3xl mb-8">Journal</h2>
      <div className="my-8">
        <Question />
      </div>
      <NewEntryButton />
      {renderEntries()}
    </main>
  )
}
