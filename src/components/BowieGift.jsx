import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import bowieImg from '../assets/images/gifts/bowie.jpeg'
import content from '../content.json'

gsap.registerPlugin(ScrollTrigger)

export default function BowieGift() {
  const { bowieGift } = content
  const sectionRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    const image = imageRef.current
    const section = sectionRef.current
    if (!image || !section) return

    gsap.set(image, {
      rotateY: -45,
      rotateX: 15,
      scale: 0.85,
      opacity: 0,
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'center center',
        scrub: 1,
      },
    })

    tl.to(image, {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
    })

    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'center center',
        end: 'bottom 25%',
        scrub: 1,
      },
    })

    tl2.to(image, {
      rotateY: 8,
      rotateX: -3,
      duration: 1,
    })

    return () => {
      tl.scrollTrigger?.kill()
      tl2.scrollTrigger?.kill()
      tl.kill()
      tl2.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center py-24 px-4 md:px-8 relative overflow-hidden"
    >
      {/* Gift number */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C73E3A]/20" />
        <span className="text-xs uppercase tracking-[0.3em] text-[#C73E3A]/30 font-sans">
          {bowieGift.giftNumber}
        </span>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C73E3A]/20" />
      </div>

      <div className="text-center mb-10">
        <h3 className="font-serif text-2xl md:text-3xl text-charcoal mb-3 tracking-tight">
          {bowieGift.title}
        </h3>
        <p className="font-sans text-sm md:text-base text-charcoal/50 leading-relaxed">
          {bowieGift.description}
        </p>
      </div>

      {/* 3D Image Container */}
      <div className="perspective-container w-full max-w-lg mx-auto">
        <div
          ref={imageRef}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="relative rounded-sm overflow-hidden border border-charcoal/8 shadow-2xl">
            <img
              src={bowieImg}
              alt="David Bowie Wandbild"
              className="w-full h-auto object-cover"
            />
            {/* Subtle overlay gradient at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-charcoal/10 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Detail card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative max-w-md mx-auto mt-14"
      >
        {/* Decorative top line */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C73E3A]/20" />
          <span className="text-sm text-[#C73E3A]/25 select-none">予約</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C73E3A]/20" />
        </div>

        <div className="text-center px-6 py-5 relative overflow-hidden rounded-sm border border-[#C73E3A]/8 bg-gradient-to-b from-white/40 to-cream/60">
          {/* Subtle pattern accent */}
          <svg className="absolute -top-2 -right-2 w-20 h-20 opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="seigaiha-gift2" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="9" fill="none" stroke="#C73E3A" strokeWidth="0.5" />
                <circle cx="10" cy="10" r="6" fill="none" stroke="#C73E3A" strokeWidth="0.5" />
                <circle cx="10" cy="10" r="3" fill="none" stroke="#C73E3A" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#seigaiha-gift2)" />
          </svg>

          <p className="font-serif text-base md:text-lg text-charcoal/70 leading-relaxed mb-2">
            {bowieGift.advisorTitle}
          </p>
          <p className="font-serif text-xl md:text-2xl text-charcoal tracking-tight mb-3">
            {bowieGift.advisorName}
          </p>
          <div className="h-px w-16 mx-auto bg-[#C73E3A]/15 mb-3" />
          <p className="font-sans text-xs md:text-sm text-charcoal/40 leading-relaxed whitespace-pre-line">
            {bowieGift.advisorDetails}
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
