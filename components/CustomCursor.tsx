'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export default function CustomCursor() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const cursorX = useMotionValue(-200)
  const cursorY = useMotionValue(-200)
  const ringX = useSpring(cursorX, { damping: 22, stiffness: 350, mass: 0.6 })
  const ringY = useSpring(cursorY, { damping: 22, stiffness: 350, mass: 0.6 })

  useEffect(() => {
    setMounted(true)
    setIsTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  useEffect(() => {
    if (!mounted || isTouch) return

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      setIsVisible(true)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      setIsHovered(
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') !== null ||
        target.closest('button') !== null
      )
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mouseover', handleMouseOver)
    document.documentElement.addEventListener('mouseleave', handleMouseLeave)
    document.documentElement.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseover', handleMouseOver)
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [mounted, isTouch, cursorX, cursorY])

  if (!mounted || isTouch || pathname === '/register') return null

  return (
    <>
      {/* Ambient glow / flashlight */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9000] hidden md:block mix-blend-screen"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 60%)',
        }}
        animate={{ scale: isHovered ? 1.4 : 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
      />

      {/* Trailing ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] hidden md:block rounded-full"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: 36,
          height: 36,
          border: '1.5px solid rgba(255,255,255,0.9)',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.5), 0 0 8px rgba(255,255,255,0.3), inset 0 0 8px rgba(255,255,255,0.05)',
        }}
        animate={{
          scale: isHovered ? 1.6 : 1,
          opacity: isVisible ? 1 : 0,
          borderColor: isHovered ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.9)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      />

      {/* Center dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          width: 6,
          height: 6,
          backgroundColor: 'white',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.5), 0 0 6px rgba(255,255,255,0.8)',
        }}
        animate={{
          scale: isHovered ? 0 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 600, damping: 28 }}
      />
    </>
  )
}
