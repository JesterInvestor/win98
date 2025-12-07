"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { Desktop } from "@/components/desktop"
import { Taskbar } from "@/components/taskbar"
import { StartMenu } from "@/components/start-menu"
import { WindowManager } from "@/components/window-manager"
import { GatePage } from "@/components/gate-page"
import { useWindows } from "@/hooks/use-windows"
import { SystemSettingsProvider } from "@/hooks/use-system-settings"

export default function Windows98Emulator() {
  const { isConnected } = useAccount()
  const [showGate, setShowGate] = useState(true)
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)
  const [sessionTime, setSessionTime] = useState(0)
  const { windows, openWindow, closeWindow, focusWindow, minimizeWindow, maximizeWindow, updateWindow } = useWindows()

  // Timer for clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Session timer - starts when wallet connects
  useEffect(() => {
    if (isConnected && !sessionStartTime) {
      setSessionStartTime(Date.now())
    } else if (!isConnected) {
      setSessionStartTime(null)
      setSessionTime(0)
    }
  }, [isConnected, sessionStartTime])

  // Update session time every second
  useEffect(() => {
    if (!sessionStartTime) return

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000)
      setSessionTime(elapsed)
    }, 1000)

    return () => clearInterval(timer)
  }, [sessionStartTime])

  const handleStartClick = () => {
    setShowStartMenu(!showStartMenu)
  }

  const handleDesktopClick = () => {
    setShowStartMenu(false)
  }

  const handleEnter = () => {
    setShowGate(false)
  }

  const handleShutdown = () => {
    setShowGate(true)
    setSessionStartTime(null)
    setSessionTime(0)
    // Close all windows
    windows.forEach((window) => closeWindow(window.id))
  }

  if (showGate) {
    return <GatePage onEnter={handleEnter} sessionTime={sessionTime} onOpenWindow={openWindow} />
  }

  return (
    <SystemSettingsProvider>
      <div className="h-screen w-full overflow-hidden bg-[#008080] relative font-['Tahoma',_sans-serif] text-xs">
        <Desktop onClick={handleDesktopClick} onOpenWindow={openWindow} />

        <WindowManager
          windows={windows}
          onClose={closeWindow}
          onFocus={focusWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onUpdate={updateWindow}
          onShutdown={handleShutdown}
        />

        {showStartMenu && <StartMenu onClose={() => setShowStartMenu(false)} onOpenWindow={openWindow} onShutdown={handleShutdown} />}

        <Taskbar
          onStartClick={handleStartClick}
          currentTime={currentTime}
          windows={windows}
          onWindowClick={focusWindow}
          sessionTime={sessionTime}
        />
      </div>
    </SystemSettingsProvider>
  )
}
