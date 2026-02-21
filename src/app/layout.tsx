import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KABUKKA MONSTER',
  description: '株を育て、市場を制せ。株式バトルゲーム',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
