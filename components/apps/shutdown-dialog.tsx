"use client"

import { Button } from "@/components/ui/button"
import { Power, RefreshCw, Moon } from "lucide-react"
import { useDisconnect } from "wagmi"

interface ShutdownDialogProps {
  onShutdown: () => void
  onCancel: () => void
}

export function ShutdownDialog({ onShutdown, onCancel }: ShutdownDialogProps) {
  const { disconnect } = useDisconnect()

  const handleShutdown = () => {
    // Disconnect wallet
    disconnect()
    // Call the shutdown handler
    onShutdown()
  }
  return (
    <div className="h-full bg-[#c0c0c0] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] p-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
              <Power size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm mb-2">Shut Down Windows</h3>
              <p className="text-xs text-gray-700 mb-3">
                Are you sure you want to shut down your computer?
              </p>
              <p className="text-xs text-gray-600">
                This will disconnect your wallet and return you to the gate page.
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input type="radio" name="shutdown-option" defaultChecked />
              <Power size={14} />
              <span>Shut down</span>
            </label>
            <label className="flex items-center gap-2 text-xs cursor-pointer opacity-50">
              <input type="radio" name="shutdown-option" disabled />
              <RefreshCw size={14} />
              <span>Restart</span>
            </label>
            <label className="flex items-center gap-2 text-xs cursor-pointer opacity-50">
              <input type="radio" name="shutdown-option" disabled />
              <Moon size={14} />
              <span>Stand by</span>
            </label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              onClick={handleShutdown}
              className="px-4 py-1 bg-[#c0c0c0] border-t-2 border-l-2 border-[#ffffff] border-r-2 border-b-2 border-r-[#000000] border-b-[#000000] active:border-t-[#000000] active:border-l-[#000000] active:border-r-[#ffffff] active:border-b-[#ffffff] text-xs hover:bg-[#d0d0d0]"
            >
              OK
            </Button>
            <Button
              onClick={onCancel}
              className="px-4 py-1 bg-[#c0c0c0] border-t-2 border-l-2 border-[#ffffff] border-r-2 border-b-2 border-r-[#000000] border-b-[#000000] active:border-t-[#000000] active:border-l-[#000000] active:border-r-[#ffffff] active:border-b-[#ffffff] text-xs hover:bg-[#d0d0d0]"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
