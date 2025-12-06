import type { Metadata } from 'next'
import './globals.css'
import { Web3Provider } from '@/lib/web3-provider'

export const metadata: Metadata = {
  title: 'WIN98 - Windows 98 Emulator',
  description: 'A nostalgic Windows 98 desktop experience with $WIN98 token integration. Connect your wallet and claim tokens!',
  keywords: ['windows98', 'emulator', 'web3', 'crypto', 'token', 'farcaster', 'base'],
  openGraph: {
    title: 'WIN98 - Windows 98 Emulator',
    description: 'Experience Windows 98 in your browser with Web3 integration',
    images: ['/windows98-logo.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  )
}
