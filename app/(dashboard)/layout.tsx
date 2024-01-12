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
    <div className="h-screen w-screen grid grid-cols-[200px,1fr]">
      <aside className="col-span-1 border-r border-black/10">
        <ul>
          {links.map((link) => (
            <Link key={link.label} href={link.href}>
              <li className="mx-4 p-2 rounded text-xl hover:bg-custom-color-trans">
                {link.label}
              </li>
            </Link>
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
