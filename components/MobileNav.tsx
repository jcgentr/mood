'use client'

import { useClerk } from '@clerk/nextjs'
import { ArrowRight, Menu } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { usePathname, useRouter } from 'next/navigation'

interface Props {
  isAuth: boolean
}

export default function MobileNav({ isAuth }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const { signOut } = useClerk()
  const router = useRouter()

  const toggleOpen = () => setIsOpen((prev) => !prev)

  const pathname = usePathname()

  useEffect(() => {
    if (isOpen) toggleOpen()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggleOpen()
    }
  }

  return (
    <div className="sm:hidden">
      <Menu
        onClick={toggleOpen}
        className="relative z-50 h-5 w-5 text-zinc-700"
      />

      {isOpen ? (
        <div className="fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full">
          <ul className="absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pt-20 pb-8">
            {isAuth ? (
              <>
                <li>
                  <Link
                    onClick={() => closeOnCurrent('/journal')}
                    className="flex items-center w-full font-semibold"
                    href="/journal"
                  >
                    Journal
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Button
                    className="flex items-center w-full font-semibold"
                    onClick={() => signOut(() => router.push('/'))}
                  >
                    Sign out
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    onClick={() => closeOnCurrent('/sign-up')}
                    className="flex items-center w-full font-semibold text-green-600"
                    href="/sign-up"
                  >
                    Get started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    onClick={() => closeOnCurrent('/sign-in')}
                    className="flex items-center w-full font-semibold"
                    href="/sign-in"
                  >
                    Sign in
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    onClick={() => closeOnCurrent('/pricing')}
                    className="flex items-center w-full font-semibold"
                    href="/pricing"
                  >
                    Pricing
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
