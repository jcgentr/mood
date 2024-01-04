import { auth } from '@clerk/nextjs'
import Link from 'next/link'

export default function HomePage() {
  const { userId }: { userId: string | null } = auth()
  const href = userId ? '/journal' : '/new-user'

  return (
    <main className="w-screen h-screen flex justify-center items-center bg-black text-white">
      <div className="w-full max-w-[900px] mx-auto p-10">
        <h1 className="text-6xl mb-4">The best journal app, period.</h1>
        <p className="text-2xl text-white/60 mb-6">
          This is the best app for tracking your mood throughout your life. All
          you have to do is be honest.
        </p>
        <div>
          <Link href={href}>
            <button className="bg-blue-600 px-4 py-2 rounded-lg text-xl hover:opacity-80">
              Get started
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}
