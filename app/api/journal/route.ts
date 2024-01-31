import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export const POST = async () => {
  const user = await getUserByClerkID()
  const entry = await prisma.journalEntry.create({
    data: {
      userId: user.id,
      content: 'Write about your day!',
    },
  })

  const initialAnalysis = {
    mood: 'neutral',
    summary: 'New entry',
    color: '#ffffff',
    negative: false,
    subject: 'My New Day',
    sentimentScore: 0,
  }
  await prisma.analysis.create({
    data: {
      userId: user.id,
      entryId: entry.id,
      ...initialAnalysis,
    },
  })

  revalidatePath('/journal')

  return NextResponse.json({ data: entry })
}
