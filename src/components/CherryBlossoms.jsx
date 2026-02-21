import { useEffect, useRef, useState } from 'react'

function createPetal() {
  return {
    x: Math.random() * 100,
    y: -10 - Math.random() * 20,
    size: 8 + Math.random() * 12,
    speedY: 0.3 + Math.random() * 0.5,
    speedX: -0.2 + Math.random() * 0.4,
    rotation: Math.random() * 360,
    rotationSpeed: -1 + Math.random() * 2,
    opacity: 0.4 + Math.random() * 0.5,
    wobbleAmplitude: 20 + Math.random() * 30,
    wobbleSpeed: 0.5 + Math.random() * 1.5,
    phase: Math.random() * Math.PI * 2,
  }
}

export default function CherryBlossoms() {
  const canvasRef = useRef(null)
  const petalsRef = useRef([])
  const animationRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const PETAL_COUNT = isMobile ? 20 : 40

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth
      canvas.height = canvas.parentElement.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Initialize petals
    petalsRef.current = Array.from({ length: PETAL_COUNT }, () => {
      const p = createPetal()
      p.y = Math.random() * 100 // Spread initially
      return p
    })

    let time = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.016

      petalsRef.current.forEach((petal) => {
        const wobbleX = Math.sin(time * petal.wobbleSpeed + petal.phase) * petal.wobbleAmplitude

        // Convert percentage to pixels
        const px = (petal.x / 100) * canvas.width + wobbleX
        const py = (petal.y / 100) * canvas.height

        ctx.save()
        ctx.translate(px, py)
        ctx.rotate((petal.rotation * Math.PI) / 180)
        ctx.globalAlpha = petal.opacity

        // Draw sakura petal shape
        const s = petal.size
        ctx.beginPath()
        ctx.fillStyle = '#FFB7C5'
        // Petal shape using bezier curves
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(s * 0.3, -s * 0.5, s * 0.8, -s * 0.5, s * 0.5, 0)
        ctx.bezierCurveTo(s * 0.8, s * 0.5, s * 0.3, s * 0.5, 0, 0)
        ctx.fill()

        // Second petal layer for depth
        ctx.fillStyle = '#E89AAE'
        ctx.globalAlpha = petal.opacity * 0.3
        ctx.beginPath()
        ctx.moveTo(s * 0.1, 0)
        ctx.bezierCurveTo(s * 0.3, -s * 0.3, s * 0.6, -s * 0.3, s * 0.4, 0)
        ctx.bezierCurveTo(s * 0.6, s * 0.3, s * 0.3, s * 0.3, s * 0.1, 0)
        ctx.fill()

        ctx.restore()

        // Update position
        petal.y += petal.speedY
        petal.x += petal.speedX * 0.3
        petal.rotation += petal.rotationSpeed

        // Reset petal when it falls below
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
  }, [isMobile])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      aria-hidden="true"
    />
  )
}
