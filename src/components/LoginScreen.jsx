import { useState } from 'react'
import { motion } from 'framer-motion'

const CODES = {
  220266: 'mama',
  gast: 'guest',
  admin: 'admin',
}

export default function LoginScreen({ onLogin }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const role = CODES[code.trim().toLowerCase()]
    if (role) {
      onLogin(role)
    } else {
      setError(true)
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 relative overflow-hidden">
      {/* Seigaiha background pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.025] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="seigaiha-login" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="18" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
            <circle cx="20" cy="20" r="14" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
            <circle cx="20" cy="20" r="10" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
            <circle cx="0" cy="20" r="18" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
            <circle cx="0" cy="20" r="14" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
            <circle cx="0" cy="20" r="10" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
            <circle cx="40" cy="20" r="18" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
            <circle cx="40" cy="20" r="14" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
            <circle cx="40" cy="20" r="10" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#seigaiha-login)" />
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative"
      >
        {/* Decorative top */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C73E3A]/20" />
          <span className="text-lg text-[#C73E3A]/20 select-none">祝</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C73E3A]/20" />
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal tracking-tight mb-2">
            Willkommen
          </h1>
          <p className="font-sans text-xs text-charcoal/35 tracking-[0.2em] uppercase">
            Bitte gib deinen Zugangscode ein
          </p>
        </div>

        {/* Code input */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            className={`relative ${shaking ? 'animate-shake' : ''}`}
          >
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                setError(false)
              }}
              placeholder="Zugangscode"
              autoComplete="off"
              className={`w-full bg-white/50 border ${
                error ? 'border-[#C73E3A]/40' : 'border-charcoal/10'
              } rounded-sm px-5 py-4 font-sans text-center text-charcoal tracking-[0.15em] text-sm placeholder:text-charcoal/25 placeholder:tracking-[0.15em] focus:outline-none focus:border-charcoal/25 transition-colors uppercase`}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-6 left-0 right-0 text-center font-sans text-xs text-[#C73E3A]/60"
              >
                Ungültiger Code
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-charcoal/5 hover:bg-charcoal/10 border border-charcoal/8 rounded-sm py-3.5 font-sans text-sm text-charcoal/60 tracking-[0.1em] transition-colors"
          >
            Eintreten
          </button>
        </form>

        {/* Decorative bottom */}
        <div className="flex items-center justify-center mt-10">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C73E3A]/15" />
          <svg className="w-4 h-4 mx-2 text-[#C73E3A]/12" viewBox="0 0 48 48" fill="currentColor">
            <ellipse cx="24" cy="14" rx="4" ry="8" transform="rotate(0 24 24)" />
            <ellipse cx="24" cy="14" rx="4" ry="8" transform="rotate(72 24 24)" />
            <ellipse cx="24" cy="14" rx="4" ry="8" transform="rotate(144 24 24)" />
            <ellipse cx="24" cy="14" rx="4" ry="8" transform="rotate(216 24 24)" />
            <ellipse cx="24" cy="14" rx="4" ry="8" transform="rotate(288 24 24)" />
            <circle cx="24" cy="24" r="2.5" />
          </svg>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C73E3A]/15" />
        </div>
      </motion.div>
    </div>
  )
}
