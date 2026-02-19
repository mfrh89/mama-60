import { useRef, Suspense, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, useGLTF, Center, ContactShadows } from '@react-three/drei'
import { motion, useInView } from 'framer-motion'

const sushiModelUrl = new URL('../assets/models/Meshy_AI_Salmon_Nigiri.glb', import.meta.url).href

function SushiModel({ scrollProgress }) {
  const groupRef = useRef()
  const { scene } = useGLTF(sushiModelUrl)

  useFrame(() => {
    if (!groupRef.current) return
    // Current view at midpoint is exactly the back — flip by adding PI
    const midAngle = 2.2 - (Math.PI / 4) - (Math.PI / 12) - (Math.PI / 12) - (Math.PI / 18) // -45° -15° -15° -10° = -85° total adjustment
    const startAngle = midAngle - Math.PI // one half-turn before midpoint
    const totalSweep = Math.PI * 2 // full rotation across 0..1
    groupRef.current.rotation.y = startAngle + scrollProgress * totalSweep
    // Slight tilt that peaks at midpoint
    groupRef.current.rotation.x = Math.sin(scrollProgress * Math.PI) * 0.12 - (Math.PI / 36) // -5° x-axis tilt
  })

  return (
    <Float speed={1} rotationIntensity={0.05} floatIntensity={0.15}>
      <group ref={groupRef}>
        <Center>
          <primitive object={scene} scale={1.8} />
        </Center>
      </group>
    </Float>
  )
}

useGLTF.preload(sushiModelUrl)

function SushiScene({ scrollProgress }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[3, 8, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      <pointLight position={[-4, 3, -2]} intensity={0.3} color="#FFF5EE" />
      <spotLight
        position={[0, 6, 0]}
        angle={0.4}
        penumbra={0.8}
        intensity={0.5}
        castShadow
      />
      <Suspense fallback={null}>
        <SushiModel scrollProgress={scrollProgress} />
      </Suspense>
      <ContactShadows
        position={[0, -0.8, 0]}
        opacity={0.15}
        scale={5}
        blur={3}
        far={6}
      />
      <Environment preset="studio" />
    </>
  )
}

export default function SushiReveal() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: false, margin: '-10%' })
  const [scrollProgress, setScrollProgress] = useState(0)

  const handleScroll = useCallback(() => {
    const section = sectionRef.current
    if (!section) return

    const rect = section.getBoundingClientRect()
    const windowH = window.innerHeight
    // Progress: 0 when section top hits viewport bottom, 1 when section bottom hits viewport top
    const total = rect.height + windowH
    const current = windowH - rect.top
    const progress = Math.max(0, Math.min(1, current / total))
    setScrollProgress(progress)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center py-24 px-4 relative"
    >
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-xs uppercase tracking-[0.3em] text-charcoal/35 font-sans mb-6"
      >
        Und das ist noch nicht alles
      </motion.p>

      {/* 3D Sushi Canvas */}
      <div className="w-full max-w-2xl h-[400px] md:h-[500px] mx-auto">
        {isInView && (
          <Canvas
            camera={{ position: [0, 3.5, 7.5], fov: 32 }}
            style={{ background: 'transparent' }}
            shadows
            dpr={[1, 2]}
          >
            <SushiScene scrollProgress={scrollProgress} />
          </Canvas>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center max-w-md mx-auto mt-4"
      >
        <h3 className="font-serif text-3xl md:text-4xl text-charcoal mb-3 tracking-tight">
          Unbegrenztes Sushi
        </h3>
        <p className="font-sans text-sm md:text-base text-charcoal/50 leading-relaxed">
          Genieße so viel Sushi wie du möchtest<br className="hidden md:block" /> während deiner Japan-Reise 2027
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative max-w-md mx-auto mt-14"
      >
        {/* Decorative top line with kanji */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C73E3A]/20" />
          <span className="text-sm text-[#C73E3A]/25 select-none">予約</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C73E3A]/20" />
        </div>

        <div className="text-center px-6 py-5 relative overflow-hidden rounded-sm border border-[#C73E3A]/8 bg-gradient-to-b from-white/40 to-cream/60">
          {/* Subtle seigaiha corner accent */}
          <svg className="absolute -top-2 -right-2 w-20 h-20 opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="seigaiha-hint" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="9" fill="none" stroke="#C73E3A" strokeWidth="0.5" />
                <circle cx="10" cy="10" r="6" fill="none" stroke="#C73E3A" strokeWidth="0.5" />
                <circle cx="10" cy="10" r="3" fill="none" stroke="#C73E3A" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#seigaiha-hint)" />
          </svg>

          <p className="font-serif text-base md:text-lg text-charcoal/70 leading-relaxed mb-2">
            Dein Reiseführer
          </p>
          <p className="font-serif text-xl md:text-2xl text-charcoal tracking-tight mb-3">
            Maximilian Huber
          </p>
          <div className="h-px w-16 mx-auto bg-[#C73E3A]/15 mb-3" />
          <p className="font-sans text-xs md:text-sm text-charcoal/40 leading-relaxed">
            Buchbar mit mindestens 6 Monaten Vorlauf.<br />
            Bei Fragen jederzeit für dich da.
          </p>
        </div>

        {/* Decorative bottom flourish */}
        <div className="flex items-center justify-center mt-4">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#C73E3A]/15" />
          <svg className="w-4 h-4 mx-2 text-[#C73E3A]/15" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="24" cy="14" rx="4" ry="8" transform="rotate(0 24 24)" />
            <ellipse cx="24" cy="14" rx="4" ry="8" transform="rotate(72 24 24)" />
            <ellipse cx="24" cy="14" rx="4" ry="8" transform="rotate(144 24 24)" />
            <ellipse cx="24" cy="14" rx="4" ry="8" transform="rotate(216 24 24)" />
            <ellipse cx="24" cy="14" rx="4" ry="8" transform="rotate(288 24 24)" />
            <circle cx="24" cy="24" r="2.5" />
          </svg>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#C73E3A]/15" />
        </div>
      </motion.div>
    </section>
  )
}
