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
        <Link href="/">
          <svg
            width="200px"
            height="100px"
            viewBox="0 0 300 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="100%" height="100%" fill="rgb(255, 247, 225)" />

            <text
              x="50%"
              y="50%"
              dominant-baseline="middle"
              text-anchor="middle"
              font-family="Verdana"
              font-size="30"
              fill="hsl(232, 26%, 50%)"
              style={{ fontWeight: 'bold' }}
            >
              mood
            </text>

            <circle cx="150" cy="70" r="10" fill="hsl(232, 26%, 50%)" />
            <circle cx="142" cy="67" r="2" fill="rgb(255, 247, 225)" />
            <circle cx="158" cy="67" r="2" fill="rgb(255, 247, 225)" />
            <path
              d="M 145,73 Q 150,77 155,73"
              stroke="rgb(255, 247, 225)"
              stroke-width="1"
              fill="none"
            />
          </svg>
        </Link>
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
