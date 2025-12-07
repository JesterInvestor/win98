"use client"

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { formatTime, formatNumber } from '@/lib/utils'

interface GatePageProps {
  onEnter: () => void
  sessionTime: number
  onOpenWindow?: (app: string) => void
}

export function GatePage({ onEnter, sessionTime, onOpenWindow }: GatePageProps) {
  const { address, isConnected } = useAccount()
  const { open } = useAppKit()
  const [earnedTokens, setEarnedTokens] = useState(0)

  useEffect(() => {
    // Calculate earned tokens based on session time (1 token per second)
    setEarnedTokens(sessionTime)
  }, [sessionTime])

  const handleClaim = () => {
    if (earnedTokens > 0) {
      // In a real app, this would trigger a smart contract transaction
      alert(`Congratulations! You have claimed ${earnedTokens} $WIN98 tokens!`)
      // Reset would happen after successful blockchain transaction
    }
  }

  const canClaim = earnedTokens > 0

  return (
    <div className="min-h-screen w-full bg-[#008080] flex items-center justify-center p-4 font-['MS_Sans_Serif',_'Tahoma',_sans-serif]">
      <div className="max-w-md w-full bg-[#c0c0c0] border-t-2 border-l-2 border-[#ffffff] border-r-2 border-b-2 border-r-[#808080] border-b-[#808080] shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] p-1">
        <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] px-2 py-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-black"></div>
            <span className="text-white font-bold text-sm">WIN98 - Gate</span>
          </div>
          <button className="w-5 h-5 bg-[#c0c0c0] border-t border-l border-white border-r border-b border-[#808080] flex items-center justify-center text-black text-xs font-bold hover:bg-[#d0d0d0]">
            ×
          </button>
        </div>
        
        <div className="bg-[#c0c0c0] p-4 space-y-4">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 bg-white border-2 border-[#808080] flex items-center justify-center">
                <div className="grid grid-cols-2 gap-1 w-16 h-16">
                  <div className="bg-red-500 rounded-sm"></div>
                  <div className="bg-green-500 rounded-sm"></div>
                  <div className="bg-blue-500 rounded-sm"></div>
                  <div className="bg-yellow-500 rounded-sm"></div>
                </div>
              </div>
            </div>
            <h1 className="text-xl font-bold mb-2">Welcome to WIN98</h1>
            <p className="text-xs">Connect your wallet to enter the Windows 98 experience</p>
          </div>

          {!isConnected ? (
            <div className="space-y-3">
              <button
                onClick={() => open()}
                className="w-full px-4 py-2 bg-[#c0c0c0] border-t-2 border-l-2 border-[#ffffff] border-r-2 border-b-2 border-r-[#000000] border-b-[#000000] active:border-t-[#000000] active:border-l-[#000000] active:border-r-[#ffffff] active:border-b-[#ffffff] text-sm hover:bg-[#d0d0d0]"
              >
                <span className="font-bold">Connect Wallet</span>
              </button>
              <p className="text-[10px] text-center text-gray-600">
                Supports Farcaster, Base, and other Web3 wallets
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-white border-t border-l border-[#808080] border-r border-b border-[#ffffff] p-2">
                <p className="text-xs mb-1">Connected:</p>
                <p className="text-[10px] font-mono break-all">{address}</p>
              </div>

              <div className="bg-white border-t border-l border-[#808080] border-r border-b border-[#ffffff] p-3">
                <p className="text-xs font-bold mb-2">Session Time & Earnings</p>
                <div className="text-center mb-3">
                  <div className="text-xs text-gray-600 mb-1">Time Connected</div>
                  <div className="text-2xl font-mono mb-2">{formatTime(sessionTime)}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">$WIN98 Earned</div>
                  <div className="text-2xl font-mono text-green-700">{formatNumber(earnedTokens)}</div>
                  <p className="text-[10px] text-gray-500 mt-1">1 token per second</p>
                </div>
              </div>

              <button
                onClick={handleClaim}
                disabled={!canClaim}
                className={`w-full px-4 py-2 bg-[#c0c0c0] border-t-2 border-l-2 border-[#ffffff] border-r-2 border-b-2 border-r-[#000000] border-b-[#000000] active:border-t-[#000000] active:border-l-[#000000] active:border-r-[#ffffff] active:border-b-[#ffffff] text-sm ${
                  canClaim ? 'hover:bg-[#d0d0d0] cursor-pointer' : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="font-bold">Claim {formatNumber(earnedTokens)} $WIN98</span>
              </button>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    if (onOpenWindow) {
                      onOpenWindow('game-menu')
                    }
                    onEnter()
                  }}
                  className="w-full px-4 py-2 bg-[#ffd966] border-t-2 border-l-2 border-[#ffffff] border-r-2 border-b-2 border-r-[#000000] border-b-[#000000] active:border-t-[#000000] active:border-l-[#000000] active:border-r-[#ffffff] active:border-b-[#ffffff] text-sm hover:bg-[#ffd86f]"
                >
                  <span className="font-bold">Floppy Disks</span>
                </button>

                <button
                  onClick={onEnter}
                  className="w-full px-4 py-2 bg-[#c0c0c0] border-t-2 border-l-2 border-[#ffffff] border-r-2 border-b-2 border-r-[#000000] border-b-[#000000] active:border-t-[#000000] active:border-l-[#000000] active:border-r-[#ffffff] active:border-b-[#ffffff] text-sm hover:bg-[#d0d0d0]"
                >
                  <span className="font-bold">Enter WIN98</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
