import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import content from '../content.json'

// Auto-import all masonry images - LAZY LOAD
const imageModules = import.meta.glob('../assets/images/masonry/*.webp')
const imagePaths = Object.keys(imageModules)

// Seeded shuffle for consistent order
const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const MasonryItem = memo(({ src, index }) => {
  const [loaded, setLoaded] = useState(false)
  const [imageSrc, setImageSrc] = useState(null)

  useEffect(() => {
    imageModules[src]().then((mod) => {
      setImageSrc(mod.default)
    })
  }, [src])

  if (!imageSrc) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="mb-3 md:mb-4 break-inside-avoid"
    >
      <div className="relative">
        <img
          src={imageSrc}
          alt={`Erinnerung ${index + 1}`}
          className={`w-full block object-cover rounded-lg transition-all duration-700 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            boxShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)'
          }}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />
      </div>
    </motion.div>
  )
})

export default function MasonryGallery() {
  const { masonryGallery } = content
  // Seeded shuffle
  const shuffled = imagePaths
    .map((src, i) => ({ src, sort: seededRandom(i * 7.3 + 42) }))
    .sort((a, b) => a.sort - b.sort)
    .map((item) => item.src)

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 md:mb-16"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-charcoal/35 font-sans mb-4">
          {masonryGallery.label}
        </p>
        <h2 className="font-serif text-2xl md:text-3xl text-charcoal tracking-tight">
          {masonryGallery.title}
        </h2>
      </motion.div>

      {/* CSS columns masonry — fully responsive */}
      <div
        className="max-w-6xl mx-auto columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4"
      >
        {shuffled.map((src, index) => (
          <MasonryItem key={src} src={src} index={index} />
        ))}
      </div>
    </section>
  )
}
