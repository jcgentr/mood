import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper'
import { Gem, Smile } from 'lucide-react'
import { buttonVariants } from './ui/button'
import { UserButton } from '@clerk/nextjs'
import { getUserSubscriptionPlan } from '@/utils/stripe'
import { cn } from '@/utils/cn'
import MobileNav from './MobileNav'

export default async function UserNavbar() {
  const subscriptionPlan = await getUserSubscriptionPlan()

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            <Smile />
            <span className="ml-1">mood</span>
          </Link>

          <MobileNav isAuth={!!subscriptionPlan.user} />

          <div className="hidden items-center space-x-4 sm:flex">
            <Link
              href="/journal"
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
              })}
            >
              Journal
            </Link>
            <Link
              href="/history"
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
              })}
            >
              History
            </Link>
            {subscriptionPlan?.isSubscribed ? (
              <Link
                href="/billing"
                className={buttonVariants({
                  variant: 'ghost',
                  size: 'sm',
                })}
              >
                Manage Subscription
              </Link>
            ) : (
              <Link
                href="/pricing"
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  }),
                  'flex justify-center items-center'
                )}
              >
                Upgrade <Gem className="text-blue-600 h-4 w-4 ml-1.5" />
              </Link>
            )}
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}
