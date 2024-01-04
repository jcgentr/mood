import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

const links = [
  { href: '/', label: 'Home' },
  { href: '/journal', label: 'Journal' },
  { href: '/history', label: 'History' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen w-screen grid grid-cols-[200px,1fr]">
      <aside className="col-span-1 border-r border-black/10">
        <div>Mood</div>
        <ul>
          {links.map((link) => (
            <li key={link.label} className="px-2 py-6 text-xl">
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </aside>
      <div className="col-span-1">
        <header className="h-[60px] border-b border-black/10">
          <div className="h-full w-full px-6 flex items-center justify-end">
            <UserButton />
          </div>
        </header>
        <div className="overflow-hidden h-[calc(100%-60px)]">{children}</div>
      </div>
    </div>
  )
}
