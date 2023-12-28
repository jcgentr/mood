import { prisma } from '@/utils/db'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

const createNewUser = async () => {
  const user = await currentUser()
  console.log(user)

  if (!user) {
    throw new Error('No current user found')
  }

  const match = await prisma.user.findUnique({
    where: {
      clerkId: user.id,
    },
  })

  if (!match) {
    await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
      },
    })
  }

  redirect('/journal')
}

export default async function NewUserPage() {
  await createNewUser()
  // this should never show
  return <div>Loading...</div>
}
