'use client'

import { createNewEntry } from '@/utils/api'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

export default function NewEntryButton() {
  const router = useRouter()

  const handleClick = async () => {
    const data = await createNewEntry()
    router.push(`/journal/${data.id}`)
  }

  return <Button onClick={handleClick}>+ New Entry</Button>
}
