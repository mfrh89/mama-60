import { useState, useEffect } from 'react'
import CherryBlossoms from './CherryBlossoms'
import ImageMarquee from './ImageMarquee'
import { motion } from 'framer-motion'
import content from '../content.json'

export default function Hero() {
  const { hero } = content
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const ageDelay = 0.2
  const titleDelay = isMobile ? 0.8 : 0.4
  const lineDelay = isMobile ? 1.4 : 0.8
  const subtitleDelay = isMobile ? 2.0 : 0.9
  const scrollDelay = isMobile ? 2.6 : 1.8

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cream">
      {/* Cherry Blossoms overlay */}
      <CherryBlossoms />

      {/* Photo Marquee - Behind content */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <ImageMarquee />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-2xl mx-auto">
        {/* Minimal age marker */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: ageDelay, ease: 'easeOut' }}
          className="mx-auto mb-10 relative"
        >
          {/* Glow hinter der Zahl */}
          <div 
            className="absolute inset-0 blur-2xl opacity-35"
            style={{
              background: 'radial-gradient(circle, #FFB7C5 0%, transparent 60%)'
            }}
          />
          <span 
            className="relative text-7xl md:text-8xl font-serif font-bold leading-none select-none"
            style={{
              background: 'linear-gradient(135deg, #C73E3A 0%, #E89AAE 50%, #C73E3A 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              animation: 'shimmer 4s ease-in-out infinite',
              filter: 'drop-shadow(0 3px 15px rgba(199, 62, 58, 0.2))'
            }}
          >
            {hero.age}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: titleDelay }}
          className="font-serif text-3xl md:text-5xl lg:text-6xl text-charcoal leading-tight mb-6 tracking-tight"
        >
          {hero.title}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: lineDelay }}
          className="w-12 h-px bg-charcoal/20 mx-auto mb-6"
        />

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: subtitleDelay }}
          className="font-sans text-base md:text-lg text-charcoal/50 mb-4 tracking-wide"
        >
          {hero.subtitle}
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: scrollDelay, duration: 1 }}
          className="animate-bounce-slow"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-charcoal/30 mb-3 font-sans">
            {hero.scrollIndicator}
          </p>
          <svg
            className="w-4 h-4 mx-auto text-charcoal/25"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>
    </section>
  )
}
