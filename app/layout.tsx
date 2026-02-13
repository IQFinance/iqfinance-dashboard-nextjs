import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IQ Finance - Instant Company Intelligence',
  description: 'Deep AI-powered analysis of any company in 30 seconds',
  keywords: 'company intelligence, AI analysis, business intelligence, company research',
  authors: [{ name: 'IQ Finance' }],
  openGraph: {
    title: 'IQ Finance - Instant Company Intelligence',
    description: 'Deep AI-powered analysis of any company in 30 seconds',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}