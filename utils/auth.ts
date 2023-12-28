import { auth } from '@clerk/nextjs'
import { prisma } from './db'
import { User } from '@prisma/client'

export const getUserByClerkID = async () => {
  const { userId } = auth()

  if (!userId) {
    throw new Error('User ID is null or undefined')
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      clerkId: userId,
    },
  })

  return user as User
}
