"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Minus, Square, X } from "lucide-react"

interface WindowProps {
  id: string
  title: string
  x: number
  y: number
  width: number
  height: number
  focused: boolean
  maximized: boolean
  minimized: boolean
  children: React.ReactNode
  onClose: () => void
  onFocus: () => void
  onMinimize: () => void
  onMaximize: () => void
  onMove: (x: number, y: number) => void
  onResize: (width: number, height: number) => void
}

export function Window({
  id,
  title,
  x,
  y,
  width,
  height,
  focused,
  maximized,
  minimized,
  children,
  onClose,
  onFocus,
  onMinimize,
  onMaximize,
  onMove,
  onResize,
}: WindowProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  if (minimized) return null

  const getPointerCoords = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    if ("touches" in (e as any) && (e as any).touches.length) {
      const t = (e as any).touches[0]
      return { clientX: t.clientX, clientY: t.clientY }
    }

    if ("changedTouches" in (e as any) && (e as any).changedTouches.length) {
      const t = (e as any).changedTouches[0]
      return { clientX: t.clientX, clientY: t.clientY }
    }

    return { clientX: (e as any).clientX, clientY: (e as any).clientY }
  }

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const target = e.target as Element
    if (target === e.currentTarget || target.classList.contains("title-bar")) {
      if ("touches" in e) {
        e.preventDefault()
      }

      const coords = getPointerCoords(e as any)
      setIsDragging(true)
      setDragStart({
        x: coords.clientX - x,
        y: coords.clientY - y,
      })
      onFocus()
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !maximized) {
      onMove(e.clientX - dragStart.x, e.clientY - dragStart.y)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
  }

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const coords = getPointerCoords(e as any)
      if (isDragging && !maximized) {
        onMove(coords.clientX - dragStart.x, coords.clientY - dragStart.y)
      }
    }

    const handleUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMove)
      document.addEventListener("mouseup", handleUp)
      document.addEventListener("touchmove", handleMove, { passive: false })
      document.addEventListener("touchend", handleUp)
      document.addEventListener("touchcancel", handleUp)
      return () => {
        document.removeEventListener("mousemove", handleMove)
        document.removeEventListener("mouseup", handleUp)
        document.removeEventListener("touchmove", handleMove)
        document.removeEventListener("touchend", handleUp)
        document.removeEventListener("touchcancel", handleUp)
      }
    }
  }, [isDragging, isResizing, dragStart, maximized, onMove])

  const windowStyle = maximized
    ? { top: 0, left: 0, width: "100%", height: "calc(100vh - 32px)" }
    : { top: y, left: x, width, height }

  return (
    <div
      ref={windowRef}
      className={`absolute bg-[#c0c0c0] border-2 border-white border-r-[#808080] border-b-[#808080] shadow-lg ${
        focused ? "z-50" : "z-40"
      }`}
      style={windowStyle}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onClick={onFocus}
    >
      {/* Title Bar */}
      <div
        className={`title-bar h-6 px-1 flex items-center justify-between ${
          focused ? "bg-gradient-to-r from-blue-600 to-blue-800" : "bg-[#808080]"
        }`}
      >
        <span className="text-white text-xs font-bold truncate">{title}</span>
        <div className="flex gap-1">
          <Button
            onClick={onMinimize}
            className="w-4 h-4 p-0 bg-[#c0c0c0] border border-[#808080] hover:bg-[#c0c0c0] text-black"
          >
            <Minus size={8} />
          </Button>
          <Button
            onClick={onMaximize}
            className="w-4 h-4 p-0 bg-[#c0c0c0] border border-[#808080] hover:bg-[#c0c0c0] text-black"
          >
            <Square size={8} />
          </Button>
          <Button
            onClick={onClose}
            className="w-4 h-4 p-0 bg-[#c0c0c0] border border-[#808080] hover:bg-[#c0c0c0] text-black"
          >
            <X size={8} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-24px)] overflow-hidden">{children}</div>

      {/* Resize Handle */}
      {!maximized && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"
          onMouseDown={(e) => {
            e.stopPropagation()
            setIsResizing(true)
          }}
          onTouchStart={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setIsResizing(true)
          }}
        />
      )}
    </div>
  )
}
