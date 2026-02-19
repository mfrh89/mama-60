import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// ============================
// SIMPLEX NOISE (inlined, minimal)
// ============================
const F2 = 0.5 * (Math.sqrt(3) - 1)
const G2 = (3 - Math.sqrt(3)) / 6
const grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]]
let perm, permMod12
function initNoise(seed) {
  const p = new Uint8Array(256)
  let s = seed
  for (let i = 0; i < 256; i++) { s = (s * 16807 + 0) % 2147483647; p[i] = s & 255 }
  perm = new Uint8Array(512); permMod12 = new Uint8Array(512)
  for (let i = 0; i < 512; i++) { perm[i] = p[i & 255]; permMod12[i] = perm[i] % 12 }
}
function noise2D(xin, yin) {
  let n0, n1, n2
  const s = (xin + yin) * F2
  const i = Math.floor(xin + s), j = Math.floor(yin + s)
  const t = (i + j) * G2
  const x0 = xin - (i - t), y0 = yin - (j - t)
  const i1 = x0 > y0 ? 1 : 0, j1 = x0 > y0 ? 0 : 1
  const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2
  const x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2
  const ii = i & 255, jj = j & 255
  let t0 = 0.5 - x0 * x0 - y0 * y0
  if (t0 < 0) n0 = 0; else { t0 *= t0; const gi = permMod12[ii + perm[jj]]; n0 = t0 * t0 * (grad3[gi][0] * x0 + grad3[gi][1] * y0) }
  let t1 = 0.5 - x1 * x1 - y1 * y1
  if (t1 < 0) n1 = 0; else { t1 *= t1; const gi = permMod12[ii + i1 + perm[jj + j1]]; n1 = t1 * t1 * (grad3[gi][0] * x1 + grad3[gi][1] * y1) }
  let t2 = 0.5 - x2 * x2 - y2 * y2
  if (t2 < 0) n2 = 0; else { t2 *= t2; const gi = permMod12[ii + 1 + perm[jj + 1]]; n2 = t2 * t2 * (grad3[gi][0] * x2 + grad3[gi][1] * y2) }
  return 70 * (n0 + n1 + n2)
}
function fbm(x, y, octaves) {
  let val = 0, amp = 0.5, freq = 1
  for (let i = 0; i < octaves; i++) { val += amp * noise2D(x * freq, y * freq); amp *= 0.5; freq *= 2 }
  return val
}
initNoise(42)

// ============================
// CONFIG
// ============================
const KOI_COUNT = 7
const PETAL_COUNT = 16
const STONE_COUNT = 18
const PLANT_COUNT = 14
const LIGHT_RAY_COUNT = 5

// ============================
// PALETTES & FACTORIES
// ============================
const KOI_PALETTES = [
  { body: '#D4612A', spots: ['#FFF8F0','#F0DCC8'], belly: '#F5E6D0', fin: '#C24A18', finTip: '#E8956A', type: 'kohaku' },
  { body: '#F2EDE4', spots: ['#D4612A','#C0392B'], belly: '#FEFCF8', fin: '#E8D5B8', finTip: '#F5EDE0', type: 'kohaku' },
  { body: '#B8281E', spots: ['#F5E6D0','#FFFFFF'], belly: '#E8A090', fin: '#8E1F16', finTip: '#D45A50', type: 'sanke' },
  { body: '#1A1A1A', spots: ['#D4612A','#C0392B'], belly: '#3A3A3A', fin: '#0D0D0D', finTip: '#2A2A2A', type: 'showa' },
  { body: '#E8C860', spots: ['#C0392B','#FFF8F0'], belly: '#F4E4BA', fin: '#D4AF37', finTip: '#F0D870', type: 'ogon' },
  { body: '#F2EDE4', spots: ['#1A1A1A','#D4612A'], belly: '#FEFCF8', fin: '#E0D0B8', finTip: '#F8F0E4', type: 'sanke' },
  { body: '#D4612A', spots: ['#1A1A1A','#FFF8F0'], belly: '#F0C8A0', fin: '#B84A1A', finTip: '#E09060', type: 'showa' },
]

function createKoi(w, h, index) {
  const palette = KOI_PALETTES[index % KOI_PALETTES.length]
  const size = 35 + Math.random() * 25
  const spotCount = 4 + Math.floor(Math.random() * 5)
  const spots = Array.from({ length: spotCount }, () => ({
    cx: -0.55 + Math.random() * 1.1,
    cy: -0.22 + Math.random() * 0.44,
    rx: 0.08 + Math.random() * 0.22,
    ry: 0.06 + Math.random() * 0.14,
    rot: -0.4 + Math.random() * 0.8,
    color: palette.spots[Math.floor(Math.random() * palette.spots.length)],
    feather: 0.3 + Math.random() * 0.5,
  }))
  return {
    x: 100 + Math.random() * (w - 200),
    y: 100 + Math.random() * (h - 200),
    size, speed: 0.25 + Math.random() * 0.3,
    angle: Math.random() * Math.PI * 2,
    targetAngle: Math.random() * Math.PI * 2,
    nextTurnTime: 3 + Math.random() * 6, turnTimer: 0,
    tailPhase: Math.random() * Math.PI * 2,
    depth: 0.5 + Math.random() * 0.5,
    palette, spots,
    // Body segments for S-curve swimming
    segments: Array.from({ length: 8 }, () => ({ x: 0, y: 0 })),
  }
}

function createPlant(w, h) {
  return {
    x: Math.random() * w, y: Math.random() * h,
    blades: Array.from({ length: 3 + Math.floor(Math.random() * 4) }, () => ({
      length: 20 + Math.random() * 35,
      angle: -0.4 + Math.random() * 0.8,
      width: 2 + Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
      hue: 120 + Math.random() * 40,
      sat: 20 + Math.random() * 25,
      light: 22 + Math.random() * 16,
    })),
  }
}

function createStone(w, h) {
  return {
    x: Math.random() * w, y: Math.random() * h,
    rx: 6 + Math.random() * 22, ry: 4 + Math.random() * 14,
    rot: Math.random() * Math.PI,
    hue: 130 + Math.random() * 50, sat: 6 + Math.random() * 14,
    light: 24 + Math.random() * 16, lightDelta: 8 + Math.random() * 10,
  }
}

function createPetal(w, h) {
  return {
    x: Math.random() * w, y: Math.random() * h,
    size: 4 + Math.random() * 7,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: -0.002 + Math.random() * 0.004,
    driftX: -0.04 + Math.random() * 0.08,
    driftY: 0.01 + Math.random() * 0.03,
    opacity: 0.25 + Math.random() * 0.35,
    waterDistort: Math.random() * Math.PI * 2,
  }
}

// ============================
// DRAW KOI (highly detailed)
// ============================
function drawKoi(ctx, koi, time) {
  const { x, y, size, angle, palette, depth, spots } = koi
  const tailSwing = Math.sin(time * 2.5 + koi.tailPhase) * 0.32
  const tailSwing2 = Math.sin(time * 2.5 + koi.tailPhase + 0.8) * 0.2
  const bodyWave = Math.sin(time * 2.5 + koi.tailPhase + 0.4) * 0.04

  // -- Shadow on riverbed --
  const so = depth * 10 + 3
  ctx.save()
  ctx.translate(x + so, y + so)
  ctx.rotate(angle)
  ctx.globalAlpha = 0.18 * (1 - depth * 0.2)
  ctx.filter = `blur(${Math.round(depth * 5 + 2)}px)`
  ctx.beginPath()
  ctx.ellipse(0, 0, size * 0.9, size * 0.35, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#0A1A10'
  ctx.fill()
  ctx.filter = 'none'
  ctx.restore()

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle + bodyWave)

  // -- Anal / ventral fin --
  ctx.save()
  ctx.translate(-size * 0.3, size * 0.22)
  ctx.rotate(0.3 + tailSwing2 * 0.3)
  ctx.globalAlpha = 0.25
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.bezierCurveTo(-size * 0.05, size * 0.1, -size * 0.15, size * 0.15, -size * 0.12, size * 0.02)
  ctx.fillStyle = palette.finTip
  ctx.fill()
  ctx.restore()

  // -- Tail fin (large, flowing, translucent with veins) --
  ctx.save()
  ctx.translate(-size * 0.72, 0)
  ctx.rotate(tailSwing)
  // Outer tail
  ctx.globalAlpha = 0.4
  ctx.beginPath()
  ctx.moveTo(size * 0.05, 0)
  ctx.bezierCurveTo(-size * 0.1, -size * 0.35, -size * 0.55, -size * 0.38, -size * 0.52, -size * 0.08)
  ctx.lineTo(-size * 0.48, 0)
  ctx.lineTo(-size * 0.52, size * 0.08)
  ctx.bezierCurveTo(-size * 0.55, size * 0.38, -size * 0.1, size * 0.35, size * 0.05, 0)
  ctx.closePath()
  const tailGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.5)
  tailGrad.addColorStop(0, palette.fin)
  tailGrad.addColorStop(1, palette.finTip)
  ctx.fillStyle = tailGrad
  ctx.fill()
  // Tail veins
  ctx.globalAlpha = 0.08
  ctx.strokeStyle = palette.fin
  ctx.lineWidth = 0.4
  for (let v = -3; v <= 3; v++) {
    const vy = v * size * 0.07
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(-size * 0.25, vy * 1.5, -size * 0.45, vy * 2)
    ctx.stroke()
  }
  ctx.restore()

  // -- Dorsal fin (on top/side) --
  ctx.save()
  ctx.translate(-size * 0.05, -size * 0.26)
  ctx.rotate(-0.15 + bodyWave)
  ctx.globalAlpha = 0.3
  ctx.beginPath()
  ctx.moveTo(-size * 0.2, 0)
  ctx.quadraticCurveTo(-size * 0.1, -size * 0.15, size * 0.05, -size * 0.12)
  ctx.quadraticCurveTo(size * 0.15, -size * 0.08, size * 0.2, 0)
  ctx.closePath()
  ctx.fillStyle = palette.finTip
  ctx.fill()
  ctx.restore()

  // -- Body --
  ctx.globalAlpha = 0.96
  const bodyGrad = ctx.createLinearGradient(0, -size * 0.35, 0, size * 0.35)
  bodyGrad.addColorStop(0, palette.body)
  bodyGrad.addColorStop(0.4, palette.body)
  bodyGrad.addColorStop(0.85, palette.belly)
  bodyGrad.addColorStop(1, palette.belly)
  ctx.beginPath()
  // More organic body shape using bezier curves
  ctx.moveTo(size * 0.72, 0)
  ctx.bezierCurveTo(size * 0.7, -size * 0.2, size * 0.4, -size * 0.32, 0, -size * 0.3)
  ctx.bezierCurveTo(-size * 0.35, -size * 0.28, -size * 0.7, -size * 0.18, -size * 0.75, 0)
  ctx.bezierCurveTo(-size * 0.7, size * 0.18, -size * 0.35, size * 0.28, 0, size * 0.3)
  ctx.bezierCurveTo(size * 0.4, size * 0.32, size * 0.7, size * 0.2, size * 0.72, 0)
  ctx.closePath()
  ctx.fillStyle = bodyGrad
  ctx.fill()

  // Body outline (very subtle)
  ctx.globalAlpha = 0.06
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 0.6
  ctx.stroke()

  // -- Scale pattern (realistic overlapping arcs) --
  ctx.globalAlpha = 0.04
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 0.3
  const scaleSize = size * 0.04
  for (let sx = -0.65; sx < 0.65; sx += 0.065) {
    for (let sy = -0.25; sy < 0.25; sy += 0.055) {
      const offset = Math.floor(sy / 0.055) % 2 === 0 ? 0.032 : 0
      const scX = (sx + offset) * size
      const scY = sy * size
      // Check if point is inside body roughly
      const bodyWidth = 0.3 * (1 - Math.abs(sx) * 0.8)
      if (Math.abs(sy) < bodyWidth) {
        ctx.beginPath()
        ctx.arc(scX, scY, scaleSize, Math.PI * 0.15, Math.PI * 0.85)
        ctx.stroke()
      }
    }
  }

  // -- Spot patterns with feathered edges --
  spots.forEach((spot) => {
    ctx.save()
    ctx.rotate(spot.rot)
    // Feathered edge (outer glow)
    ctx.globalAlpha = 0.3 * spot.feather
    ctx.beginPath()
    ctx.ellipse(spot.cx * size, spot.cy * size, spot.rx * size * 1.2, spot.ry * size * 1.2, 0, 0, Math.PI * 2)
    ctx.fillStyle = spot.color
    ctx.fill()
    // Core spot
    ctx.globalAlpha = 0.8
    ctx.beginPath()
    ctx.ellipse(spot.cx * size, spot.cy * size, spot.rx * size, spot.ry * size, 0, 0, Math.PI * 2)
    ctx.fillStyle = spot.color
    ctx.fill()
    ctx.restore()
  })

  // -- Lateral line --
  ctx.globalAlpha = 0.06
  ctx.beginPath()
  ctx.moveTo(-size * 0.55, 0)
  ctx.bezierCurveTo(-size * 0.2, -size * 0.015, size * 0.2, -size * 0.01, size * 0.5, 0)
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 0.5
  ctx.stroke()

  // -- Pectoral fins (translucent, with rays) --
  const finPhase = Math.sin(time * 2 + koi.tailPhase) * 0.3
  ;[{ side: -1, yOff: -size * 0.27 }, { side: 1, yOff: size * 0.27 }].forEach(({ side, yOff }) => {
    ctx.save()
    ctx.translate(size * 0.2, yOff)
    ctx.rotate(side * (-0.5 + finPhase))
    ctx.globalAlpha = 0.25
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(size * 0.05, side * -size * 0.12, size * 0.2, side * -size * 0.18, size * 0.15, side * -size * 0.04)
    ctx.bezierCurveTo(size * 0.12, 0, size * 0.05, side * size * 0.02, 0, 0)
    const finGrad = ctx.createLinearGradient(0, 0, size * 0.15, side * -size * 0.12)
    finGrad.addColorStop(0, palette.fin)
    finGrad.addColorStop(1, palette.finTip)
    ctx.fillStyle = finGrad
    ctx.fill()
    // Fin rays
    ctx.globalAlpha = 0.06
    ctx.lineWidth = 0.3
    ctx.strokeStyle = palette.fin
    for (let r = 0; r < 4; r++) {
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(size * (0.08 + r * 0.03), side * -size * (0.06 + r * 0.03))
      ctx.stroke()
    }
    ctx.restore()
  })

  // -- Head --
  ctx.globalAlpha = 0.97
  const headGrad = ctx.createRadialGradient(size * 0.55, 0, 0, size * 0.55, 0, size * 0.32)
  headGrad.addColorStop(0, palette.body)
  headGrad.addColorStop(0.7, palette.body)
  headGrad.addColorStop(1, palette.belly)
  ctx.beginPath()
  // Tapered head shape
  ctx.moveTo(size * 0.78, 0)
  ctx.bezierCurveTo(size * 0.76, -size * 0.08, size * 0.65, -size * 0.2, size * 0.4, -size * 0.24)
  ctx.bezierCurveTo(size * 0.35, -size * 0.25, size * 0.3, -size * 0.24, size * 0.3, -size * 0.2)
  ctx.lineTo(size * 0.3, size * 0.2)
  ctx.bezierCurveTo(size * 0.3, size * 0.24, size * 0.35, size * 0.25, size * 0.4, size * 0.24)
  ctx.bezierCurveTo(size * 0.65, size * 0.2, size * 0.76, size * 0.08, size * 0.78, 0)
  ctx.closePath()
  ctx.fillStyle = headGrad
  ctx.fill()

  // -- Gill cover line --
  ctx.globalAlpha = 0.08
  ctx.beginPath()
  ctx.arc(size * 0.38, 0, size * 0.22, -Math.PI * 0.35, Math.PI * 0.35)
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 0.6
  ctx.stroke()

  // -- Mouth --
  ctx.globalAlpha = 0.2
  ctx.beginPath()
  ctx.arc(size * 0.77, 0, size * 0.025, 0, Math.PI * 2)
  ctx.fillStyle = '#3A2820'
  ctx.fill()

  // -- Barbels (whiskers — characteristic of koi) --
  ctx.globalAlpha = 0.15
  ctx.strokeStyle = palette.body
  ctx.lineWidth = 0.5
  ctx.beginPath()
  ctx.moveTo(size * 0.73, -size * 0.03)
  ctx.quadraticCurveTo(size * 0.82, -size * 0.06, size * 0.85, -size * 0.08)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(size * 0.73, size * 0.03)
  ctx.quadraticCurveTo(size * 0.82, size * 0.06, size * 0.85, size * 0.08)
  ctx.stroke()

  // -- Eyes --
  // Eye socket
  ctx.globalAlpha = 0.15
  ctx.beginPath()
  ctx.arc(size * 0.6, -size * 0.1, size * 0.065, 0, Math.PI * 2)
  ctx.fillStyle = '#1A1410'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(size * 0.6, size * 0.1, size * 0.065, 0, Math.PI * 2)
  ctx.fillStyle = '#1A1410'
  ctx.fill()
  // Eye white
  ctx.globalAlpha = 0.9
  ctx.beginPath()
  ctx.arc(size * 0.6, -size * 0.1, size * 0.05, 0, Math.PI * 2)
  ctx.fillStyle = '#F0ECE4'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(size * 0.6, size * 0.1, size * 0.05, 0, Math.PI * 2)
  ctx.fillStyle = '#F0ECE4'
  ctx.fill()
  // Iris
  ctx.globalAlpha = 1
  ctx.beginPath()
  ctx.arc(size * 0.605, -size * 0.1, size * 0.032, 0, Math.PI * 2)
  ctx.fillStyle = '#18120E'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(size * 0.605, size * 0.1, size * 0.032, 0, Math.PI * 2)
  ctx.fillStyle = '#18120E'
  ctx.fill()
  // Specular highlight
  ctx.globalAlpha = 0.6
  ctx.beginPath()
  ctx.arc(size * 0.61, -size * 0.104, size * 0.012, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(size * 0.61, size * 0.096, size * 0.012, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()

  // -- Wet sheen highlight (top of body) --
  ctx.globalAlpha = 0.07
  const sheenGrad = ctx.createLinearGradient(-size * 0.3, -size * 0.28, size * 0.1, 0)
  sheenGrad.addColorStop(0, '#FFF')
  sheenGrad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.beginPath()
  ctx.ellipse(size * 0.05, -size * 0.1, size * 0.5, size * 0.12, -0.05, 0, Math.PI * 2)
  ctx.fillStyle = sheenGrad
  ctx.fill()

  ctx.restore()
}

// ============================
// MAIN COMPONENT
// ============================
export default function KoiRiver() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const stateRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let dpr = window.devicePixelRatio || 1
    let W, H

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const parent = canvas.parentElement
      W = parent.offsetWidth
      H = parent.offsetHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // -- Generate offscreen noise textures for water --
    const noiseCanvas = document.createElement('canvas')
    const nSize = 256
    noiseCanvas.width = nSize
    noiseCanvas.height = nSize
    const nCtx = noiseCanvas.getContext('2d')
    const nData = nCtx.createImageData(nSize, nSize)
    // Pre-compute a static noise texture
    for (let py = 0; py < nSize; py++) {
      for (let px = 0; px < nSize; px++) {
        const v = (fbm(px * 0.02, py * 0.02, 4) + 1) * 0.5
        const idx = (py * nSize + px) * 4
        nData.data[idx] = Math.floor(v * 30 + 50)
        nData.data[idx + 1] = Math.floor(v * 50 + 90)
        nData.data[idx + 2] = Math.floor(v * 40 + 75)
        nData.data[idx + 3] = 255
      }
    }
    nCtx.putImageData(nData, 0, 0)

    // Init entities
    const kois = Array.from({ length: KOI_COUNT }, (_, i) => createKoi(W, H, i))
    const stones = Array.from({ length: STONE_COUNT }, () => createStone(W, H))
    const plants = Array.from({ length: PLANT_COUNT }, () => createPlant(W, H))
    const petals = Array.from({ length: PETAL_COUNT }, () => createPetal(W, H))

    stateRef.current = { kois, stones, plants, petals }

    let time = 0

    const draw = () => {
      time += 0.016
      ctx.globalAlpha = 1

      // ============================
      // WATER BASE — tiled noise texture with animated offset
      // ============================
      const offsetX = Math.sin(time * 0.04) * 30
      const offsetY = time * 4
      const pattern = ctx.createPattern(noiseCanvas, 'repeat')
      ctx.save()
      ctx.translate(offsetX, offsetY % nSize)
      ctx.fillStyle = pattern
      ctx.fillRect(-offsetX - nSize, -(offsetY % nSize) - nSize, W + nSize * 2, H + nSize * 2)
      ctx.restore()

      // Colour overlay to unify the water tone
      ctx.globalAlpha = 0.55
      const waterOverlay = ctx.createLinearGradient(0, 0, W * 0.3, H)
      waterOverlay.addColorStop(0, '#2F5E4E')
      waterOverlay.addColorStop(0.5, '#3A6B5A')
      waterOverlay.addColorStop(1, '#2C5548')
      ctx.fillStyle = waterOverlay
      ctx.fillRect(0, 0, W, H)
      ctx.globalAlpha = 1

      // ============================
      // ANIMATED CAUSTICS (noise-based)
      // ============================
      ctx.globalAlpha = 0.06
      for (let i = 0; i < 18; i++) {
        const cx = (noise2D(i * 1.3, time * 0.05) * 0.5 + 0.5) * W
        const cy = (noise2D(time * 0.04, i * 1.7) * 0.5 + 0.5) * H
        const r = 30 + noise2D(i * 0.5, time * 0.1) * 30
        const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        cg.addColorStop(0, 'rgba(160,210,185,0.7)')
        cg.addColorStop(0.5, 'rgba(160,210,185,0.2)')
        cg.addColorStop(1, 'rgba(160,210,185,0)')
        ctx.fillStyle = cg
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // ============================
      // DEPTH DARKENING
      // ============================
      ctx.globalAlpha = 0.06
      for (let i = 0; i < 5; i++) {
        const dx = (Math.sin(i * 3.7 + 1.2) * 0.4 + 0.5) * W
        const dy = (Math.cos(i * 4.3 + 0.8) * 0.4 + 0.5) * H
        const dr = 100 + i * 40
        const dg = ctx.createRadialGradient(dx, dy, 0, dx, dy, dr)
        dg.addColorStop(0, 'rgba(0,15,8,0.5)')
        dg.addColorStop(1, 'rgba(0,15,8,0)')
        ctx.fillStyle = dg
        ctx.fillRect(dx - dr, dy - dr, dr * 2, dr * 2)
      }
      ctx.globalAlpha = 1

      // ============================
      // RIVERBED STONES
      // ============================
      stones.forEach((s) => {
        ctx.save()
        ctx.translate(s.x, s.y)
        ctx.rotate(s.rot)
        // Stone shadow
        ctx.globalAlpha = 0.08
        ctx.beginPath()
        ctx.ellipse(2, 2, s.rx + 2, s.ry + 2, 0, 0, Math.PI * 2)
        ctx.fillStyle = '#000'
        ctx.fill()
        // Stone body
        ctx.globalAlpha = 0.22
        const sg = ctx.createRadialGradient(-s.rx * 0.2, -s.ry * 0.2, 0, 0, 0, Math.max(s.rx, s.ry))
        sg.addColorStop(0, `hsl(${s.hue}, ${s.sat}%, ${s.light + s.lightDelta}%)`)
        sg.addColorStop(1, `hsl(${s.hue}, ${s.sat}%, ${s.light}%)`)
        ctx.beginPath()
        ctx.ellipse(0, 0, s.rx, s.ry, 0, 0, Math.PI * 2)
        ctx.fillStyle = sg
        ctx.fill()
        ctx.restore()
      })

      // ============================
      // UNDERWATER PLANTS (swaying)
      // ============================
      plants.forEach((plant) => {
        plant.blades.forEach((blade) => {
          const sway = Math.sin(time * 0.6 + blade.phase) * 0.15
          ctx.save()
          ctx.translate(plant.x, plant.y)
          ctx.globalAlpha = 0.35
          ctx.strokeStyle = `hsl(${blade.hue}, ${blade.sat}%, ${blade.light}%)`
          ctx.lineWidth = blade.width
          ctx.lineCap = 'round'
          ctx.beginPath()
          ctx.moveTo(0, 0)
          const cpx = Math.sin(blade.angle + sway) * blade.length * 0.6
          const cpy = -blade.length * 0.6
          const ex = Math.sin(blade.angle + sway * 1.5) * blade.length * 0.3
          const ey = -blade.length
          ctx.quadraticCurveTo(cpx, cpy, ex, ey)
          ctx.stroke()
          // Slightly lighter edge
          ctx.globalAlpha = 0.1
          ctx.lineWidth = blade.width * 0.4
          ctx.strokeStyle = `hsl(${blade.hue}, ${blade.sat - 5}%, ${blade.light + 15}%)`
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.quadraticCurveTo(cpx, cpy, ex, ey)
          ctx.stroke()
          ctx.restore()
        })
      })

      // ============================
      // KOI FISH (depth-sorted)
      // ============================
      const sortedKoi = [...kois].sort((a, b) => a.depth - b.depth)

      sortedKoi.forEach((koi) => {
        koi.turnTimer += 0.016

        if (koi.turnTimer > koi.nextTurnTime) {
          koi.targetAngle = koi.angle + (-0.6 + Math.random() * 1.2)
          koi.nextTurnTime = 3 + Math.random() * 7
          koi.turnTimer = 0
        }

        // Edge avoidance
        const margin = 90
        if (koi.x < margin) koi.targetAngle = Math.random() * 0.5 - 0.25
        else if (koi.x > W - margin) koi.targetAngle = Math.PI + Math.random() * 0.5 - 0.25
        if (koi.y < margin) koi.targetAngle = Math.PI * 0.5 + Math.random() * 0.5 - 0.25
        else if (koi.y > H - margin) koi.targetAngle = -Math.PI * 0.5 + Math.random() * 0.5 - 0.25

        let diff = koi.targetAngle - koi.angle
        while (diff > Math.PI) diff -= Math.PI * 2
        while (diff < -Math.PI) diff += Math.PI * 2
        koi.angle += diff * 0.012

        koi.x += Math.cos(koi.angle) * koi.speed
        koi.y += Math.sin(koi.angle) * koi.speed

        // Wake disturbance
        ctx.globalAlpha = 0.02
        const wakeX = koi.x - Math.cos(koi.angle) * koi.size * 0.8
        const wakeY = koi.y - Math.sin(koi.angle) * koi.size * 0.8
        for (let wr = 0; wr < 3; wr++) {
          const rr = koi.size * (0.2 + wr * 0.15) + Math.sin(time * 3 + wr) * 2
          ctx.beginPath()
          ctx.arc(wakeX - Math.cos(koi.angle) * wr * 5, wakeY - Math.sin(koi.angle) * wr * 5, rr, 0, Math.PI * 2)
          ctx.strokeStyle = 'rgba(180,215,195,0.4)'
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
        ctx.globalAlpha = 1

        // Water distortion around koi (subtle light ring)
        ctx.globalAlpha = 0.03
        ctx.beginPath()
        ctx.ellipse(koi.x, koi.y, koi.size * 0.9, koi.size * 0.4, koi.angle, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(200,230,215,0.3)'
        ctx.lineWidth = 1.5
        ctx.stroke()
        ctx.globalAlpha = 1

        drawKoi(ctx, koi, time)
      })

      // ============================
      // SURFACE RIPPLES (noise-driven)
      // ============================
      ctx.globalAlpha = 0.025
      ctx.strokeStyle = 'rgba(190,225,210,0.4)'
      ctx.lineWidth = 0.5
      for (let i = 0; i < 10; i++) {
        const rx = (noise2D(i * 2.3, time * 0.03) * 0.5 + 0.5) * W
        const ry = (noise2D(time * 0.025, i * 2.8) * 0.5 + 0.5) * H
        const rr = 10 + noise2D(i, time * 0.1) * 15
        for (let ring = 0; ring < 3; ring++) {
          ctx.beginPath()
          ctx.arc(rx, ry, rr + ring * rr * 0.7, 0, Math.PI * 2)
          ctx.stroke()
        }
      }
      ctx.globalAlpha = 1

      // ============================
      // FLOATING PETALS (surface layer)
      // ============================
      petals.forEach((p) => {
        p.x += p.driftX
        p.y += p.driftY
        p.rotation += p.rotSpeed
        // Slight water distortion wobble
        const wobX = Math.sin(time * 0.5 + p.waterDistort) * 0.3
        const wobY = Math.cos(time * 0.4 + p.waterDistort) * 0.2
        p.x += wobX
        p.y += wobY

        if (p.y > H + 10 || p.x < -10 || p.x > W + 10) {
          Object.assign(p, createPetal(W, H))
          p.y = -5
        }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        // Petal shadow on water
        ctx.globalAlpha = p.opacity * 0.15
        ctx.beginPath()
        const s = p.size
        ctx.ellipse(1, 1, s * 0.4, s * 0.25, 0, 0, Math.PI * 2)
        ctx.fillStyle = '#000'
        ctx.fill()
        // Petal
        ctx.globalAlpha = p.opacity
        ctx.beginPath()
        ctx.fillStyle = '#F0BCC8'
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(s * 0.3, -s * 0.5, s * 0.8, -s * 0.5, s * 0.5, 0)
        ctx.bezierCurveTo(s * 0.8, s * 0.5, s * 0.3, s * 0.5, 0, 0)
        ctx.fill()
        // Petal highlight
        ctx.globalAlpha = p.opacity * 0.4
        ctx.fillStyle = '#FFF'
        ctx.beginPath()
        ctx.ellipse(s * 0.25, 0, s * 0.1, s * 0.06, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // ============================
      // LIGHT RAYS (diagonal, animated)
      // ============================
      for (let i = 0; i < LIGHT_RAY_COUNT; i++) {
        const rx = (noise2D(i * 3.1, time * 0.015) * 0.5 + 0.5) * W
        const rayWidth = 40 + noise2D(i * 1.5, time * 0.02) * 30
        const rayAlpha = 0.015 + noise2D(i * 2.1, time * 0.03) * 0.01
        ctx.globalAlpha = Math.max(0, rayAlpha)
        ctx.save()
        ctx.translate(rx, 0)
        ctx.rotate(0.15 + noise2D(i, time * 0.01) * 0.1)
        const rayGrad = ctx.createLinearGradient(-rayWidth / 2, 0, rayWidth / 2, 0)
        rayGrad.addColorStop(0, 'rgba(200,230,210,0)')
        rayGrad.addColorStop(0.5, 'rgba(200,230,210,0.3)')
        rayGrad.addColorStop(1, 'rgba(200,230,210,0)')
        ctx.fillStyle = rayGrad
        ctx.fillRect(-rayWidth / 2, 0, rayWidth, H * 1.3)
        ctx.restore()
      }
      ctx.globalAlpha = 1

      // ============================
      // SURFACE LIGHT SHEEN
      // ============================
      ctx.globalAlpha = 0.025
      const sheen = ctx.createLinearGradient(0, 0, W * 0.5, H * 0.3)
      sheen.addColorStop(0, 'rgba(255,255,255,0.5)')
      sheen.addColorStop(0.4, 'rgba(255,255,255,0)')
      ctx.fillStyle = sheen
      ctx.fillRect(0, 0, W, H)
      ctx.globalAlpha = 1

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <section className="relative overflow-hidden">
      <div className="relative w-full h-[55vh] md:h-[70vh]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />

        {/* Top edge fade */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-cream to-transparent pointer-events-none z-10" />

        {/* Bottom edge fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream to-transparent pointer-events-none z-10" />

        {/* Overlay text */}
        <div className="absolute inset-0 flex items-end justify-center pb-28 md:pb-32 pointer-events-none z-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="font-serif text-sm md:text-base text-white/30 tracking-widest"
          >
            鯉 — Stärke und Ausdauer
          </motion.p>
        </div>
      </div>
    </section>
  )
}
