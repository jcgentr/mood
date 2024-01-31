'use client'

import { Loader2, Trash } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import Link from 'next/link'
import { trpc } from '@/app/_trpc/client'
import { useState } from 'react'

export default function EntryCard({ entry }: { entry: any }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const utils = trpc.useUtils()
  const { mutate: deleteUserEntry } = trpc.deleteUserEntry.useMutation({
    onSuccess: () => {
      utils.getUserEntries.invalidate()
    },
    onMutate() {
      setIsDeleting(true)
    },
    onSettled() {
      setIsDeleting(false)
    },
  })

  const date = new Date(entry.createdAt).toLocaleString()

  return (
    <li className="overflow-hidden rounded-lg bg-white shadow flex justify-between hover:opacity-70 hover:border-black border">
      <div className="w-full">
        <Link href={`/journal/${entry.id}`}>
          <div className="px-4 py-3">{date}</div>
          <div className="px-4 py-3">{entry.analysis.summary}</div>
          <div className="px-4 py-3">Mood: {entry.analysis.mood}</div>
        </Link>
      </div>

      <div className="p-4">
        <AlertDialog>
          <AlertDialogTrigger disabled={isDeleting}>
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash className="hover:text-destructive" />
            )}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                journal entry.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteUserEntry({ id: entry.id })}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </li>
  )
}
