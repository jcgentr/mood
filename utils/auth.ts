import { auth } from '@clerk/nextjs'
import { prisma } from './db'
import { User } from '@prisma/client'
import { redirect } from 'next/navigation'

export const getUserByClerkID = async () => {
  const { userId } = auth()

  if (!userId) {
    console.error('User ID is null or undefined')
    redirect('/sign-in')
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      clerkId: userId,
    },
  })

  return user as User
}
