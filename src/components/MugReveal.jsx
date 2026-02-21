import { useRef, Suspense, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, useGLTF, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { motion, useInView } from 'framer-motion'
import content from '../content.json'

const mugModelUrl = new URL('../assets/models/Meshy_AI_Mug.glb', import.meta.url).href

// ── Manuelle Anpassung ──────────────────────────────
const MUG_SCALE = 1.6       // Größe der Tasse
const MUG_OFFSET_X = 0.3   // Horizontale Verschiebung der Tasse (positiv = rechts)
const MUG_PIVOT = [0, 0]    // Rotationszentrum [X, Z] relativ zur Tasse (X: positiv = rechts, Z: positiv = vorne)
const MUG_TILT_X = 0.0      // Neigung X-Achse (positiv = nach hinten kippen, in Radiant)
const MUG_TILT_Z = 0.2      // Neigung Z-Achse (positiv = nach rechts kippen, in Radiant)
// ─────────────────────────────────────────────────────

function MugModel() {
  const groupRef = useRef()
  const { scene } = useGLTF(mugModelUrl)

  const adjustedScene = useMemo(() => {
    const clonedScene = scene.clone()
    const box = new THREE.Box3().setFromObject(clonedScene)
    const bottomY = box.min.y
    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2
    // Boden auf y=0, horizontal zentriert + manueller Offset
    clonedScene.position.set(-centerX * MUG_SCALE + MUG_OFFSET_X, -bottomY * MUG_SCALE, -centerZ * MUG_SCALE)
    clonedScene.scale.setScalar(MUG_SCALE)
    return clonedScene
  }, [scene])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.3
  })

  return (
    <Float speed={1} rotationIntensity={0.03} floatIntensity={0.1}>
      {/* Äußere Gruppe: verschiebt Pivot */}
      <group position={[MUG_PIVOT[0], 0, MUG_PIVOT[1]]} ref={groupRef} rotation={[MUG_TILT_X, 0, MUG_TILT_Z]}>
        {/* Innere Gruppe: verschiebt Tasse zurück */}
        <group position={[-MUG_PIVOT[0], 0, -MUG_PIVOT[1]]}>
          <primitive object={adjustedScene} />
        </group>
      </group>
    </Float>
  )
}

useGLTF.preload(mugModelUrl)

function MugScene() {
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
      <Suspense fallback={
        <mesh>
          <cylinderGeometry args={[0.8, 0.8, 1.2, 32]} />
          <meshStandardMaterial color="#FFB7C5" opacity={0.3} transparent />
        </mesh>
      }>
        <MugModel />
      </Suspense>
      <ContactShadows
        position={[0, -0.25, 0]}
        opacity={0.2}
        scale={4.5}
        blur={3}
        far={2}
      />
      <Environment preset="studio" />
    </>
  )
}

export default function MugReveal() {
  const { mugReveal } = content
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: false, margin: '-10%' })

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
        className="text-xs uppercase tracking-[0.3em] text-charcoal/35 font-sans mb-8"
      >
        {mugReveal.label}
      </motion.p>

      {/* 3D Mug Canvas */}
      <div className="w-full max-w-2xl h-[400px] md:h-[480px] mx-auto relative">
        {isInView ? (
          <Canvas
            camera={{ position: [0, 1.2, 7], fov: 38 }}
            style={{ background: 'transparent' }}
            shadows
            dpr={[1, 2]}
            onCreated={({ camera }) => camera.lookAt(0, 1.2, 0)}
          >
            <MugScene />
          </Canvas>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-charcoal/10 border-t-charcoal/30 rounded-full animate-spin" />
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center max-w-md mx-auto mt-6"
      >
        <h3 className="font-serif text-3xl md:text-4xl text-charcoal mb-3 tracking-tight">
          {mugReveal.title}
        </h3>
        <p className="font-sans text-sm md:text-base text-charcoal/50 leading-relaxed">
          {mugReveal.description}
        </p>
      </motion.div>
    </section>
  )
}
