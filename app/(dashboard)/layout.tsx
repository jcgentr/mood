import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import UserNavbar from '@/components/UserNavbar'
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
    <>
      <UserNavbar />
      <MaxWidthWrapper className="h-full">{children}</MaxWidthWrapper>
    </>
  )
}
