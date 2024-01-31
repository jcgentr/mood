import { prisma } from '@/utils/db'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { LoadingScreen } from './loading'

const createNewUser = async () => {
  const user = await currentUser()
  console.log(user)
  // this should never happen since Clerk protects this route/page
  if (!user) {
    console.error('No current user found')
    redirect('/sign-in')
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      clerkId: user.id,
    },
  })

  if (!dbUser) {
    await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
      },
    })
  }
  await new Promise((resolve) => setTimeout(resolve, 5000))
  redirect('/journal')
}

export default async function NewUserPage() {
  await createNewUser()
  // this should never show
  return <LoadingScreen />
}
