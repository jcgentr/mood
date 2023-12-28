import { UserButton } from '@clerk/nextjs'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen w-screen grid grid-cols-[200px,1fr]">
      <aside className="col-span-1 border-r border-black/10">Mood</aside>
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
