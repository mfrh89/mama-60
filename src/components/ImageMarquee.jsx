import { useState, useEffect } from 'react'
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

  if (images.length === 0) return null

  const duplicatedImages = [...images, ...images]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.2 }}
      className="w-full h-full overflow-hidden flex items-center"
    >
      <div className="flex animate-marquee items-center">
        {duplicatedImages.map((image, index) => {
          const rand2 = seededRandom(index * 2.3)
          const rand3 = seededRandom(index * 3.7)
          const rand4 = seededRandom(index * 4.1)
          const rand5 = seededRandom(index * 5.9)
          
          // Distribute images across vertical lanes to fill the viewport evenly
          // 5 lanes from top to bottom, cycling through them with a shuffle
          const laneOrder = [0, 3, 1, 4, 2]
          const lane = laneOrder[index % laneOrder.length]
          const laneBase = -375 + lane * 187.5 // 5 lanes across 750px range
          // Add small random jitter within the lane (+/- 40px)
          const jitter = (rand5 - 0.5) * 80
          const offsetY = laneBase + jitter
          
          const offsetX = (rand2 - 0.5) * 40
          const marginH = 12 + rand3 * 50
          const scale = 0.75 + rand4 * 0.5
          
          // Größe je nach Orientierung
          const isLandscape = image.orientation === 'landscape'
          const baseWidth = isLandscape ? 384 : 256
          const baseHeight = isLandscape ? 256 : 384
          const width = baseWidth * scale
          const height = baseHeight * scale
          
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
                boxShadow: '0 12px 50px rgba(0,0,0,0.3)'
              }}
            >
              <img
                src={image.src}
                alt={`Memory ${(index % images.length) + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
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
