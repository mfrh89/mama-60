import { motion } from 'framer-motion'

const images = [
  '/assets/photo1.jpg',
  '/assets/photo2.jpg',
  '/assets/photo3.jpg',
  '/assets/photo4.jpg',
  '/assets/photo5.jpg',
]

// Pseudo-random function for consistent values across re-renders
const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export default function ImageMarquee() {
  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.2 }}
      className="w-full h-full overflow-hidden flex items-center"
    >
      <div className="flex animate-marquee items-center">
        {duplicatedImages.map((src, index) => {
          // Use seeded random for consistent but varied values
          const rand1 = seededRandom(index * 1.5)
          const rand2 = seededRandom(index * 2.3)
          const rand3 = seededRandom(index * 3.7)
          const rand4 = seededRandom(index * 4.1)
          
          // Vertical offset: -80 to +80 pixels (more jitter)
          const offsetY = (rand1 - 0.5) * 160
          
          // Horizontal offset: -20 to +20 pixels (add horizontal jitter)
          const offsetX = (rand2 - 0.5) * 40
          
          // Variable spacing: 8 to 56 pixels (more variation)
          const marginH = 8 + rand3 * 48
          
          // Size variation: 0.75 to 1.25 scale (more dramatic)
          const scale = 0.75 + rand4 * 0.5
          
          // Base dimensions
          const baseWidth = 256
          const baseHeight = 384
          const width = baseWidth * scale
          const height = baseHeight * scale
          
          return (
            <div
              key={index}
              className="flex-shrink-0 rounded-lg overflow-hidden bg-charcoal/5 border border-charcoal/10 relative shadow-lg"
              style={{ 
                transform: `translate(${offsetX}px, ${offsetY}px)`,
                marginLeft: `${marginH}px`,
                marginRight: `${marginH}px`,
                width: `${width}px`,
                height: `${height}px`
              }}
            >
              <img
                src={src}
                alt={`Memory ${(index % images.length) + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              <div className="text-charcoal/30 text-sm font-sans absolute inset-0 flex items-center justify-center pointer-events-none bg-cream/50">
                Bild {((index % images.length) + 1)}
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
