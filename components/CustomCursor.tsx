'use client'

import { useState, useEffect } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button')
      ) {
        setIsHovered(true)
      } else {
        setIsHovered(false)
      }
    }

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [cursorX, cursorY])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-[600px] h-[600px] pointer-events-none z-[9000] hidden md:block mix-blend-screen"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)',
        }}
        animate={{ scale: isHovered ? 1.5 : 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-white pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%', rotate: 45 }}
        animate={{ scale: isHovered ? 6 : 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-white pointer-events-none z-[9998] mix-blend-difference flex items-center justify-center bg-transparent hidden md:block"
        style={{ x: cursorXSpring, y: cursorYSpring, translateX: '-50%', translateY: '-50%' }}
        animate={{ rotate: isHovered ? 90 : 45, scale: isHovered ? 0 : 1, opacity: isHovered ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
    </>
  )
}
