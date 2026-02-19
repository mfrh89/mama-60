import CherryBlossoms from './CherryBlossoms'
import ImageMarquee from './ImageMarquee'
import { motion } from 'framer-motion'

export default function Hero() {
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
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mx-auto mb-10"
        >
          <span className="text-6xl md:text-8xl font-serif font-bold text-charcoal/10 leading-none select-none">
            60
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-3xl md:text-5xl lg:text-6xl text-charcoal leading-tight mb-6 tracking-tight"
        >
          Alles Gute zum Geburtstag
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="w-12 h-px bg-charcoal/20 mx-auto mb-6"
        />

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="font-sans text-base md:text-lg text-charcoal/50 mb-4 tracking-wide"
        >
          Für die beste Mama der Welt
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="animate-bounce-slow"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-charcoal/30 mb-3 font-sans">
            Scrolle nach unten
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
