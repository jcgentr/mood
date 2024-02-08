import Providers from '@/components/Providers'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

const links = [
  { href: '/journal', label: 'Journal' },
  { href: '/history', label: 'History' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className=" h-[calc(100vh-180px)] grid grid-cols-[200px,1fr]">
      <aside className="col-span-1">
        <ul>
          {links.map((link) => (
            <Link key={link.label} href={link.href}>
              <li className="mx-4 p-2 rounded text-xl">{link.label}</li>
            </Link>
          ))}
        </ul>
      </aside>
      <div className="col-span-1 h-full">
        <header className="h-[60px]">
          <div className="h-full w-full px-6 flex items-center justify-end">
            <UserButton />
          </div>
        </header>
        <main className="h-full">{children}</main>
      </div>
    </div>
  )
}
