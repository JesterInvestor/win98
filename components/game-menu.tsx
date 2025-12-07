"use client"

import { useState, useEffect, useRef } from 'react'

interface GameMenuProps {
  onDiskClick?: (diskId: string) => void
  onSwipeDown?: () => void
  onArrowDown?: () => void
}

export function GameMenu({ onDiskClick, onSwipeDown, onArrowDown }: GameMenuProps) {
  const [selectedDisk, setSelectedDisk] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [dialogContent, setDialogContent] = useState({ title: '', message: '' })
  const audioContextRef = useRef<AudioContext | null>(null)
  const touchStartYRef = useRef(0)

  useEffect(() => {
    // Initialize Web Audio API
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    // Handle arrow key press
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        handleArrowDownAction()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const playSound = (type: 'floppy' | 'hover' | 'swipe') => {
    if (!audioContextRef.current) return

    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    switch (type) {
      case 'floppy':
        oscillator.type = 'sawtooth'
        oscillator.frequency.setValueAtTime(200, ctx.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3)
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + 0.3)
        break
      case 'hover':
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(800, ctx.currentTime)
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)
        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + 0.05)
        break
      case 'swipe':
        oscillator.type = 'square'
        oscillator.frequency.setValueAtTime(600, ctx.currentTime)
        oscillator.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + 0.1)
        break
    }
  }

  const handleDiskClick = (diskId: string, diskName: string, diskProgram: string) => {
    playSound('floppy')
    setSelectedDisk(diskId)

    let message = ''
    switch (diskId) {
      case 'load1':
        message = 'Loading classic Windows 98 games...\n\n• Minesweeper\n• Solitaire\n• Snake'
        break
      case 'load2':
        message = 'Loading applications...\n\n• Notepad\n• Paint\n• Calculator\n• Internet Explorer'
        break
      case 'load3':
        message = 'Opening Control Panel...\n\n• Display Settings\n• Sound Settings\n• System Properties'
        break
      case 'load4':
        message = '🎮 You found the secret disk! 🎮\n\nThis unlocks hidden features and easter eggs.'
        break
      default:
        message = 'Unknown disk format.'
    }

    setDialogContent({ title: diskName, message })
    setShowDialog(true)
    
    if (onDiskClick) {
      onDiskClick(diskId)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.changedTouches[0].pageY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].pageY
    const swipeDistance = touchEndY - touchStartYRef.current

    if (swipeDistance > 50) {
      handleSwipeDownAction()
    }
  }

  const handleSwipeDownAction = () => {
    playSound('swipe')
    setDialogContent({
      title: 'Swipe Down Detected!',
      message: 'You swiped down on the screen.\n\nThis can be used to navigate through menus.'
    })
    setShowDialog(true)
    if (onSwipeDown) {
      onSwipeDown()
    }
  }

  const handleArrowDownAction = () => {
    playSound('swipe')
    setDialogContent({
      title: 'Arrow Key Detected!',
      message: 'You pressed the Down Arrow key (↓).\n\nThis can be used to navigate through menus.'
    })
    setShowDialog(true)
    if (onArrowDown) {
      onArrowDown()
    }
  }

  const disks = [
    { id: 'load1', name: 'DISK 1', subtitle: 'GAMES.EXE', position: 'top-[15%] left-[10%] rotate-[-8deg]' },
    { id: 'load2', name: 'DISK 2', subtitle: 'APPS.EXE', position: 'top-[25%] right-[15%] rotate-[12deg]' },
    { id: 'load3', name: 'DISK 3', subtitle: 'SETTINGS.EXE', position: 'bottom-[20%] left-[20%] rotate-[-15deg]' },
    { id: 'load4', name: 'DISK 4', subtitle: 'SECRET.EXE', position: 'bottom-[15%] right-[12%] rotate-[10deg]' },
  ]

  return (
    <div 
      className="relative w-full h-screen bg-gradient-to-br from-[#008080] to-[#006666] flex flex-col items-center justify-center overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Scanlines effect */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.05)_0px,rgba(0,0,0,0.05)_1px,transparent_1px,transparent_2px)]" />

      {/* Keyboard area */}
      <div className="relative w-[90%] max-w-[900px] animate-[shake_2s_ease-in-out_infinite]">
        {/* Keyboard */}
        <div className="bg-gradient-to-br from-[#e0e0e0] to-[#c0c0c0] border-4 border-[#808080] rounded-xl p-5 shadow-[0_8px_16px_rgba(0,0,0,0.5)] transform perspective-1000 rotate-x-[5deg]">
          {/* Keyboard rows */}
          <div className="space-y-1">
            <div className="flex gap-1 justify-center">
              {['ESC', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].map(key => (
                <div key={key} className="bg-gradient-to-b from-[#f0f0f0] to-[#d0d0d0] border-2 border-[#a0a0a0] rounded px-2 py-2 min-w-[40px] h-[40px] flex items-center justify-center text-[10px] font-bold shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  {key}
                </div>
              ))}
            </div>
            <div className="flex gap-1 justify-center">
              {['~', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='].map(key => (
                <div key={key} className="bg-gradient-to-b from-[#f0f0f0] to-[#d0d0d0] border-2 border-[#a0a0a0] rounded px-2 py-2 min-w-[40px] h-[40px] flex items-center justify-center text-[10px] font-bold shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  {key}
                </div>
              ))}
              <div className="bg-gradient-to-b from-[#f0f0f0] to-[#d0d0d0] border-2 border-[#a0a0a0] rounded px-2 py-2 min-w-[60px] h-[40px] flex items-center justify-center text-[10px] font-bold shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                BKSP
              </div>
            </div>
            <div className="flex gap-1 justify-center">
              <div className="bg-gradient-to-b from-[#f0f0f0] to-[#d0d0d0] border-2 border-[#a0a0a0] rounded px-2 py-2 min-w-[60px] h-[40px] flex items-center justify-center text-[10px] font-bold shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                TAB
              </div>
              {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map(key => (
                <div key={key} className="bg-gradient-to-b from-[#f0f0f0] to-[#d0d0d0] border-2 border-[#a0a0a0] rounded px-2 py-2 min-w-[40px] h-[40px] flex items-center justify-center text-[10px] font-bold shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  {key}
                </div>
              ))}
            </div>
            <div className="flex gap-1 justify-center">
              <div className="bg-gradient-to-b from-[#f0f0f0] to-[#d0d0d0] border-2 border-[#a0a0a0] rounded px-2 py-2 min-w-[75px] h-[40px] flex items-center justify-center text-[10px] font-bold shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                CAPS
              </div>
              {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map(key => (
                <div key={key} className="bg-gradient-to-b from-[#f0f0f0] to-[#d0d0d0] border-2 border-[#a0a0a0] rounded px-2 py-2 min-w-[40px] h-[40px] flex items-center justify-center text-[10px] font-bold shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  {key}
                </div>
              ))}
              <div className="bg-gradient-to-b from-[#f0f0f0] to-[#d0d0d0] border-2 border-[#a0a0a0] rounded px-2 py-2 min-w-[75px] h-[40px] flex items-center justify-center text-[10px] font-bold shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                ENTER
              </div>
            </div>
            <div className="flex gap-1 justify-center">
              <div className="bg-gradient-to-b from-[#f0f0f0] to-[#d0d0d0] border-2 border-[#a0a0a0] rounded px-2 py-2 min-w-[90px] h-[40px] flex items-center justify-center text-[10px] font-bold shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                SHIFT
              </div>
              {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map(key => (
                <div key={key} className="bg-gradient-to-b from-[#f0f0f0] to-[#d0d0d0] border-2 border-[#a0a0a0] rounded px-2 py-2 min-w-[40px] h-[40px] flex items-center justify-center text-[10px] font-bold shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  {key}
                </div>
              ))}
              <div className="bg-gradient-to-b from-[#f0f0f0] to-[#d0d0d0] border-2 border-[#a0a0a0] rounded px-2 py-2 min-w-[90px] h-[40px] flex items-center justify-center text-[10px] font-bold shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                SHIFT
              </div>
            </div>
            <div className="flex gap-1 justify-center">
              <div className="bg-gradient-to-b from-[#f0f0f0] to-[#d0d0d0] border-2 border-[#a0a0a0] rounded px-2 py-2 min-w-[60px] h-[40px] flex items-center justify-center text-[10px] font-bold shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                CTRL
              </div>
              <div className="bg-gradient-to-b from-[#f0f0f0] to-[#d0d0d0] border-2 border-[#a0a0a0] rounded px-2 py-2 min-w-[250px] h-[40px] flex items-center justify-center text-[10px] font-bold shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                SPACE
              </div>
              <div className="bg-gradient-to-b from-[#f0f0f0] to-[#d0d0d0] border-2 border-[#a0a0a0] rounded px-2 py-2 min-w-[60px] h-[40px] flex items-center justify-center text-[10px] font-bold shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                CTRL
              </div>
            </div>
          </div>
        </div>

        {/* Floppy disks */}
        {disks.map((disk) => (
          <button
            key={disk.id}
            className={`absolute w-[120px] h-[140px] bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-3 border-black rounded-lg cursor-pointer shadow-[0_8px_16px_rgba(0,0,0,0.8)] transition-all duration-200 hover:scale-110 hover:translate-y-[-5px] hover:shadow-[0_12px_24px_rgba(0,0,0,0.9)] hover:z-20 active:scale-105 active:translate-y-[-2px] z-10 p-2.5 flex flex-col ${disk.position}`}
            onClick={() => handleDiskClick(disk.id, disk.name, disk.subtitle)}
            onMouseEnter={() => playSound('hover')}
          >
            {/* Floppy disk top */}
            <div className="w-full h-[25px] bg-gradient-to-r from-[#3a3a3a] to-[#2a2a2a] rounded mb-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" />
            
            {/* Floppy disk label */}
            <div className="flex-1 bg-[#f0f0f0] border-2 border-[#666] rounded flex flex-col items-center justify-center p-2 mb-2">
              <span className="text-sm font-bold text-black font-mono">{disk.name}</span>
              <span className="text-[9px] text-[#666] mt-1 font-mono">{disk.subtitle}</span>
            </div>
            
            {/* Floppy disk metal shutter */}
            <div className="w-full h-5 bg-gradient-to-r from-[#888] via-[#666] to-[#888] rounded shadow-[0_2px_4px_rgba(0,0,0,0.5)] relative">
              <div className="absolute w-[30%] h-full bg-black/30 left-[35%] rounded" />
            </div>
          </button>
        ))}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-lg font-bold shadow-[2px_2px_4px_rgba(0,0,0,0.8)] z-[100] bg-black/40 px-8 py-4 rounded-lg border-2 border-white/30">
        <span className="inline-block mr-2 text-2xl animate-[blink_1s_infinite]">▼</span>
        Swipe down or press ↓ to continue...
      </div>

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] animate-[fadeIn_0.2s]" onClick={() => setShowDialog(false)}>
          <div className="bg-[#c0c0c0] border-[3px] border-t-white border-l-white border-r-black border-b-black shadow-[0_8px_16px_rgba(0,0,0,0.8)] min-w-[300px] max-w-[500px]" onClick={(e) => e.stopPropagation()}>
            {/* Title bar */}
            <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] text-white px-2 py-1 flex items-center justify-between font-bold text-sm">
              <span>{dialogContent.title}</span>
              <button 
                className="bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-black border-b-black w-5 h-5 flex items-center justify-center text-black text-base leading-none hover:bg-[#d0d0d0] active:border-t-black active:border-l-black active:border-r-white active:border-b-white"
                onClick={() => setShowDialog(false)}
              >
                ×
              </button>
            </div>
            
            {/* Body */}
            <div className="p-5 flex gap-4 items-start">
              <div className="text-[32px] flex-shrink-0">ℹ️</div>
              <div className="text-[13px] leading-relaxed text-black whitespace-pre-line">
                {dialogContent.message}
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-3 flex justify-center">
              <button 
                className="bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-black border-b-black px-8 py-1.5 text-[13px] cursor-pointer min-w-[80px] hover:bg-[#d0d0d0] active:border-t-black active:border-l-black active:border-r-white active:border-b-white focus:outline focus:outline-1 focus:outline-dotted focus:outline-black focus:outline-offset-[-4px]"
                onClick={() => setShowDialog(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: rotateX(5deg) rotate(-0.5deg) translateY(0); }
          25% { transform: rotateX(5deg) rotate(0.5deg) translateY(-2px); }
          50% { transform: rotateX(5deg) rotate(-0.3deg) translateY(0); }
          75% { transform: rotateX(5deg) rotate(0.3deg) translateY(-1px); }
        }
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
