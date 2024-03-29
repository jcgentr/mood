import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Inter } from 'next/font/google'
import { cn } from '@/utils/cn'
import Navbar from '@/components/Navbar'
import 'react-loading-skeleton/dist/skeleton.css'
import Providers from '@/components/Providers'
import { constructMetadata } from '@/utils/meta'

const inter = Inter({ subsets: ['latin'] })

export const metadata = constructMetadata()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en" className="light">
          <body
            className={cn(
              'min-h-screen font-sans antialiased grainy',
              inter.className
            )}
          >
            {children}
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  )
}
