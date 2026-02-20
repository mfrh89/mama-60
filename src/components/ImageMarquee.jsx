import { useState, useEffect, useCallback, useRef } from 'react'
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
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight)
  const containerRef = useRef(null)
  const animationRef = useRef(null)
  const positionRef = useRef(0)

  useEffect(() => {
    const onResize = () => setViewportHeight(window.innerHeight)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

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
                orientation: img.naturalWidth >= img.naturalHeight ? 'landscape' : 'portrait',
              })
            }
            img.onerror = () => {
              resolve({ src, orientation: 'portrait' })
            }
            img.src = src
          })
      )
    ).then((loaded) => {
      // Seeded shuffle so order is consistent across renders
      const shuffled = loaded
        .map((img, i) => ({ ...img, sort: seededRandom(i * 7.3) }))
        .sort((a, b) => a.sort - b.sort)
      setImages(shuffled)
    })
  }, [])

  // JavaScript-based animation for better iOS performance
  useEffect(() => {
    if (!containerRef.current || images.length === 0) return

    const animate = () => {
      positionRef.current -= 0.5 // Speed: pixels per frame
      
      // Get the width of the container's children to know when to reset
      const container = containerRef.current
      if (container) {
        const halfWidth = container.scrollWidth / 2
        
        // Reset position when we've scrolled through half the content
        if (Math.abs(positionRef.current) >= halfWidth) {
          positionRef.current = 0
        }
        
        container.style.transform = `translateX(${positionRef.current}px)`
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [images])

  if (images.length === 0) return null

  const duplicatedImages = [...images, ...images]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.2 }}
      className="w-full h-full overflow-hidden flex items-center"
    >
      <div 
        ref={containerRef}
        className="flex items-center"
        style={{ willChange: 'transform' }}
      >
        {duplicatedImages.map((image, index) => {
          const rand2 = seededRandom(index * 2.3)
          const rand3 = seededRandom(index * 3.7)
          const rand4 = seededRandom(index * 4.1)
          const rand5 = seededRandom(index * 5.9)
          
          const offsetX = (rand2 - 0.5) * 40
          const marginH = 12 + rand3 * 50
          const scale = 0.75 + rand4 * 0.5
          
          // Größe je nach Orientierung — auf kleinen Viewports etwas kleiner
          const isLandscape = image.orientation === 'landscape'
          const viewportScale = Math.min(1, viewportHeight / 900)
          const baseWidth = (isLandscape ? 384 : 256) * viewportScale
          const baseHeight = (isLandscape ? 256 : 384) * viewportScale
          const width = baseWidth * scale
          const height = baseHeight * scale

          // Distribute images across vertical lanes relative to viewport height
          // Subtract image height + shadow bleed so images & shadows stay within bounds
          const shadowBleed = 80
          const available = Math.max(0, viewportHeight - height - shadowBleed * 2)
          const laneOrder = [0, 3, 1, 4, 2]
          const lane = laneOrder[index % laneOrder.length]
          const laneBase = -(available / 2) + lane * (available / 4)
          // Add small random jitter within the lane
          const jitter = (rand5 - 0.5) * (available * 0.06)
          const offsetY = laneBase + jitter
          
          return (
            <div
              key={index}
              className="flex-shrink-0 rounded-lg overflow-hidden bg-charcoal/5 border border-charcoal/5 relative"
              style={{ 
                transform: `translate(${offsetX}px, ${offsetY}px)`,
                marginLeft: `${marginH}px`,
                marginRight: `${marginH}px`,
                width: `${width}px`,
                height: `${height}px`,
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
              }}
            >
              <img
                src={image.src}
                alt={`Memory ${(index % images.length) + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ 
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
                loading="eager"
                onError={(e) => {
                  console.error('Image failed to load:', image.src)
                  e.target.style.display = 'none'
                }}
              />
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
