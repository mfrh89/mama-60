import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { SeigaihaPattern, SakuraFlower } from './Patterns'

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

// February 22, 2026 00:00:00 Berlin time (CET = UTC+1 in winter)
const TARGET_DATE = new Date('2026-02-22T00:00:00+01:00')

function useCountdown() {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = Math.max(0, TARGET_DATE.getTime() - now)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  const isComplete = diff === 0

  return { days, hours, minutes, seconds, isComplete }
}

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="font-serif text-3xl md:text-4xl text-charcoal tabular-nums leading-none"
        style={{
          background: 'linear-gradient(135deg, #C73E3A 0%, #E89AAE 50%, #C73E3A 100%)',
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          animation: 'shimmer 4s ease-in-out infinite',
        }}
      >
        {String(value).padStart(2, '0')}
      </motion.span>
      <span className="font-sans text-[10px] text-charcoal/35 tracking-[0.15em] uppercase mt-1.5">
        {label}
      </span>
    </div>
  )
}

function Countdown() {
  const { days, hours, minutes, seconds, isComplete } = useCountdown()

  if (isComplete) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="mb-8"
    >
      <p className="font-sans text-[10px] text-charcoal/30 tracking-[0.2em] uppercase mb-4 text-center">
        Noch
      </p>
      <div className="flex items-center justify-center gap-4 md:gap-6">
        <CountdownUnit value={days} label="Tage" />
        <span className="font-serif text-xl text-charcoal/15 -mt-4">:</span>
        <CountdownUnit value={hours} label="Std" />
        <span className="font-serif text-xl text-charcoal/15 -mt-4">:</span>
        <CountdownUnit value={minutes} label="Min" />
        <span className="font-serif text-xl text-charcoal/15 -mt-4">:</span>
        <CountdownUnit value={seconds} label="Sek" />
      </div>
    </motion.div>
  )
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
      <SeigaihaPattern id="seigaiha-login" />

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

        {/* Countdown */}
        <Countdown />

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
          <SakuraFlower className="w-5 h-5 mx-2" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C73E3A]/15" />
        </div>
      </motion.div>
    </div>
  )
}
