import Editor from '@/components/Editor'
import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { notFound } from 'next/navigation'

const getEntry = async (id: string) => {
  const user = await getUserByClerkID()
  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
    },
    include: {
      analysis: true,
    },
  })

  return entry
}

interface PageProps {
  params: {
    id: string
  }
}

export default async function EntryPage({ params }: PageProps) {
  const entry = await getEntry(params.id)

  if (!entry) {
    return notFound()
  }

  return (
    <div className="h-full">
      <Editor entry={entry} />
    </div>
  )
}
