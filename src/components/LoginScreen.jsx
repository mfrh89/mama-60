import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const CODES = {
  220266: 'mama',
  gast: 'guest',
  admin: 'admin',
}

const PETAL_COUNT = 12

function createPetal() {
  return {
    x: Math.random() * 100,
    y: -10 - Math.random() * 20,
    size: 8 + Math.random() * 12,
    speedY: 0.15 + Math.random() * 0.25,
    speedX: -0.1 + Math.random() * 0.2,
    rotation: Math.random() * 360,
    rotationSpeed: -0.5 + Math.random() * 1,
    opacity: 0.3 + Math.random() * 0.4,
    wobbleAmplitude: 15 + Math.random() * 25,
    wobbleSpeed: 0.3 + Math.random() * 0.8,
    phase: Math.random() * Math.PI * 2,
  }
}

function LoginCherryBlossoms() {
  const canvasRef = useRef(null)
  const petalsRef = useRef([])
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth
      canvas.height = canvas.parentElement.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    petalsRef.current = Array.from({ length: PETAL_COUNT }, () => {
      const p = createPetal()
      p.y = Math.random() * 100
      return p
    })

    let time = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.012

      petalsRef.current.forEach((petal) => {
        const wobbleX = Math.sin(time * petal.wobbleSpeed + petal.phase) * petal.wobbleAmplitude

        const px = (petal.x / 100) * canvas.width + wobbleX
        const py = (petal.y / 100) * canvas.height

        ctx.save()
        ctx.translate(px, py)
        ctx.rotate((petal.rotation * Math.PI) / 180)
        ctx.globalAlpha = petal.opacity

        const s = petal.size
        ctx.beginPath()
        ctx.fillStyle = '#FFB7C5'
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(s * 0.3, -s * 0.5, s * 0.8, -s * 0.5, s * 0.5, 0)
        ctx.bezierCurveTo(s * 0.8, s * 0.5, s * 0.3, s * 0.5, 0, 0)
        ctx.fill()

        ctx.fillStyle = '#E89AAE'
        ctx.globalAlpha = petal.opacity * 0.3
        ctx.beginPath()
        ctx.moveTo(s * 0.1, 0)
        ctx.bezierCurveTo(s * 0.3, -s * 0.3, s * 0.6, -s * 0.3, s * 0.4, 0)
        ctx.bezierCurveTo(s * 0.6, s * 0.3, s * 0.3, s * 0.3, s * 0.1, 0)
        ctx.fill()

        ctx.restore()

        petal.y += petal.speedY
        petal.x += petal.speedX * 0.3
        petal.rotation += petal.rotationSpeed

        if (petal.y > 110) {
          Object.assign(petal, createPetal())
        }
      })

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      aria-hidden="true"
    />
  )
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

      {/* Langsame Kirschblüten */}
      <LoginCherryBlossoms />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-20"
      >
        {/* Decorative top */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C73E3A]/20" />
          <span className="text-2xl text-[#C73E3A]/30 select-none font-serif">60</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C73E3A]/20" />
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-2xl md:text-3xl text-charcoal tracking-wide mb-3">
            Sechzig Frühling
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
              } rounded-sm px-5 py-4 font-sans text-center text-charcoal tracking-[0.15em] text-base placeholder:text-charcoal/25 placeholder:tracking-[0.15em] focus:outline-none focus:border-charcoal/25 transition-colors uppercase`}
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
            className="w-full bg-[#F1C5C1] hover:bg-[#E5B4B0] text-charcoal border border-[#F1C5C1] rounded-sm py-4 font-sans text-sm font-medium tracking-[0.15em] transition-all shadow-md hover:shadow-lg hover:scale-[1.02]"
          >
            Eintreten
          </button>
        </form>

        {/* Decorative bottom - kleine Sakura */}
        <div className="flex items-center justify-center mt-10">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C73E3A]/15" />
          <svg className="w-5 h-5 mx-2" viewBox="0 0 20 20">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <ellipse 
                key={i}
                cx="10" 
                cy="5" 
                rx="2.5" 
                ry="4.5" 
                fill="#FFB7C5"
                opacity="0.6"
                transform={`rotate(${angle} 10 10)`}
              />
            ))}
            <circle cx="10" cy="10" r="2" fill="#E89AAE" opacity="0.8" />
          </svg>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C73E3A]/15" />
        </div>
      </motion.div>
    </div>
  )
}
