import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AACProvider } from '@/contexts/aac-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AAC Connect - Adaptive Communication',
  description: 'Empowering communication through adaptive AAC technology',
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AACProvider>
          {children}
        </AACProvider>
      </body>
    </html>
  )
}
