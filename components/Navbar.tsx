import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper'
import { ArrowRight, Smile } from 'lucide-react'
import { buttonVariants } from './ui/button'
import MobileNav from './MobileNav'

export default function Navbar() {
  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            <Smile />
            <span className="ml-1">mood</span>
          </Link>

          <MobileNav isAuth={false} />

          <div className="hidden items-center space-x-4 sm:flex">
            <Link
              href="/pricing"
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
              })}
            >
              Pricing
            </Link>
            <Link
              href="/sign-in"
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
              })}
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className={buttonVariants({
                size: 'sm',
              })}
            >
              Get started <ArrowRight className="ml-1.5 h-5 w-5" />
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}
