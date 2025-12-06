"use client"

import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { base, mainnet } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import type { ReactNode } from 'react'

// 1. Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

// 2. Set up the Wagmi adapter
const networks = [mainnet, base]

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
})

// 3. Create the AppKit instance
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  features: {
    analytics: true,
    email: false,
    socials: ['farcaster'],
    onramp: false,
  },
  metadata: {
    name: 'WIN98 Emulator',
    description: 'Windows 98 Emulator with $WIN98 Token',
    url: 'https://win98.vercel.app',
    icons: ['https://win98.vercel.app/windows98-logo.png'],
  },
})

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
