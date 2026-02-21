import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KABUKKA MONSTER',
  description: 'Raise your stocks. Conquer the market. A stock battle game.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
