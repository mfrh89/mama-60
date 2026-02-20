import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// Auto-import all images from slider folder
const imageModules = import.meta.glob('../assets/images/slider/*.{jpeg,jpg,png,webp}', { eager: true })

// Build images array, detect orientation via native Image loading
const imagePaths = Object.values(imageModules).map((mod) => mod.default)

const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export default function ImageMarquee() {
  const [images, setImages] = useState([])
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const imagesDataRef = useRef([])
  const offsetXRef = useRef(0)

  useEffect(() => {
    // Detect orientation for each image
    Promise.all(
      imagePaths.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image()
            img.onload = () => {
              resolve({
                src,
                img,
                orientation: img.naturalWidth >= img.naturalHeight ? 'landscape' : 'portrait',
              })
            }
            img.onerror = () => {
              resolve(null)
            }
            img.src = src
          })
      )
    ).then((loaded) => {
      // Filter out failed images and shuffle
      const valid = loaded.filter(Boolean)
      const shuffled = valid
        .map((img, i) => ({ ...img, sort: seededRandom(i * 7.3) }))
        .sort((a, b) => a.sort - b.sort)
      setImages(shuffled)
    })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || images.length === 0) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    // Set canvas size
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener('resize', resize)

    const viewportHeight = canvas.getBoundingClientRect().height

    // Prepare image data with positions
    const prepareImages = () => {
      const imageData = []
      const duplicatedImages = [...images, ...images, ...images] // Triple for smoother loop

      duplicatedImages.forEach((image, index) => {
        const rand2 = seededRandom(index * 2.3)
        const rand3 = seededRandom(index * 3.7)
        const rand4 = seededRandom(index * 4.1)
        const rand5 = seededRandom(index * 5.9)

        const offsetY = (rand2 - 0.5) * 40
        const marginH = 12 + rand3 * 50
        const scale = 0.75 + rand4 * 0.5

        const isLandscape = image.orientation === 'landscape'
        const viewportScale = Math.min(1, viewportHeight / 900)
        const baseWidth = (isLandscape ? 384 : 256) * viewportScale
        const baseHeight = (isLandscape ? 256 : 384) * viewportScale
        const width = baseWidth * scale
        const height = baseHeight * scale

        const shadowBleed = 80
        const available = Math.max(0, viewportHeight - height - shadowBleed * 2)
        const laneOrder = [0, 3, 1, 4, 2]
        const lane = laneOrder[index % laneOrder.length]
        const laneBase = -(available / 2) + lane * (available / 4)
        const jitter = (rand5 - 0.5) * (available * 0.06)
        const y = viewportHeight / 2 + laneBase + jitter

        // Calculate cumulative x position
        const prevImage = imageData[imageData.length - 1]
        const x = prevImage ? prevImage.x + prevImage.width + prevImage.marginH + marginH : marginH

        imageData.push({
          img: image.img,
          x,
          y,
          width,
          height,
          marginH,
          offsetY,
        })
      })

      return imageData
    }

    imagesDataRef.current = prepareImages()
    const totalWidth = imagesDataRef.current[imagesDataRef.current.length - 1].x + 
                       imagesDataRef.current[imagesDataRef.current.length - 1].width

    // Animation loop
    let lastTime = performance.now()
    const speed = 30 // pixels per second

    const animate = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 1000
      lastTime = currentTime

      // Update offset
      offsetXRef.current -= speed * deltaTime

      // Reset when we've moved one third of the way (since we tripled the images)
      const resetPoint = totalWidth / 3
      if (Math.abs(offsetXRef.current) >= resetPoint) {
        offsetXRef.current += resetPoint
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

      // Draw images
      imagesDataRef.current.forEach((imageData) => {
        const drawX = imageData.x + offsetXRef.current
        const drawY = imageData.y + imageData.offsetY

        // Only draw if visible
        const canvasWidth = canvas.width / dpr
        if (drawX + imageData.width > 0 && drawX < canvasWidth) {
          // Draw shadow
          ctx.save()
          ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'
          ctx.shadowBlur = 30
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = 8

          // Draw rounded rectangle for shadow
          const radius = 8
          ctx.beginPath()
          ctx.roundRect(drawX, drawY, imageData.width, imageData.height, radius)
          ctx.fillStyle = 'rgba(45, 45, 45, 0.05)'
          ctx.fill()
          ctx.restore()

          // Draw image with rounded corners
          ctx.save()
          ctx.beginPath()
          ctx.roundRect(drawX, drawY, imageData.width, imageData.height, radius)
          ctx.clip()
          ctx.drawImage(imageData.img, drawX, drawY, imageData.width, imageData.height)
          ctx.restore()

          // Draw border
          ctx.save()
          ctx.strokeStyle = 'rgba(45, 45, 45, 0.05)'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.roundRect(drawX, drawY, imageData.width, imageData.height, radius)
          ctx.stroke()
          ctx.restore()
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [images])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.2 }}
      className="w-full h-full overflow-hidden flex items-center"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </motion.div>
  )
}
