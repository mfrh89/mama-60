import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function MusicalTicket() {
  const sectionRef = useRef(null)
  const ticketRef = useRef(null)

  useEffect(() => {
    const ticket = ticketRef.current
    const section = sectionRef.current
    if (!ticket || !section) return

    gsap.set(ticket, {
      rotateY: -20,
      rotateX: 8,
      scale: 0.9,
      opacity: 0,
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        end: 'center center',
        scrub: 1,
      },
    })

    tl.to(ticket, {
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
        end: 'bottom 30%',
        scrub: 1,
      },
    })

    tl2.to(ticket, {
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
      className="min-h-screen flex flex-col items-center justify-center py-24 px-4 relative"
    >
      {/* Gift number label */}
      <div className="flex items-center justify-center gap-3 mb-12">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C73E3A]/20" />
        <span className="text-xs uppercase tracking-[0.3em] text-[#C73E3A]/30 font-sans">
          Geschenk I
        </span>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C73E3A]/20" />
      </div>

      {/* 3D Ticket Container */}
      <div className="perspective-container w-full max-w-3xl mx-auto">
        <div
          ref={ticketRef}
          className="mx-2 md:mx-4"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Ticket shell — horizontal concert ticket */}
          <div className="flex rounded-md overflow-hidden shadow-2xl relative">

            {/* ===== Holographic shimmer overlay (covers entire ticket) ===== */}
            <div
              className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-md"
              style={{ mixBlendMode: 'overlay' }}
            >
              {/* Animated shimmer band */}
              <div
                className="absolute inset-0 animate-shimmer"
                style={{
                  background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0) 38%, rgba(255,255,255,0.18) 46%, rgba(255,230,235,0.12) 50%, rgba(255,255,255,0.18) 54%, rgba(255,255,255,0) 62%, transparent 80%)',
                  backgroundSize: '300% 100%',
                }}
              />
              {/* Secondary subtle rainbow shimmer */}
              <div
                className="absolute inset-0 animate-shimmer-slow"
                style={{
                  background: 'linear-gradient(120deg, transparent 25%, rgba(255,200,210,0) 42%, rgba(255,190,205,0.08) 48%, rgba(225,210,245,0.06) 52%, rgba(210,225,250,0.05) 56%, rgba(255,200,210,0) 58%, transparent 75%)',
                  backgroundSize: '400% 100%',
                }}
              />
            </div>

            {/* Sparkle particles */}
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-md">
              {[
                { top: '15%', left: '22%', delay: '0s', size: 2.5 },
                { top: '50%', left: '60%', delay: '2.5s', size: 2 },
                { top: '70%', left: '35%', delay: '5s', size: 2 },
                { top: '28%', left: '78%', delay: '1.5s', size: 2.5 },
                { top: '82%', left: '15%', delay: '4s', size: 2 },
              ].map((s, i) => (
                <div
                  key={i}
                  className="absolute animate-sparkle rounded-full bg-white/70"
                  style={{
                    top: s.top,
                    left: s.left,
                    width: `${s.size}px`,
                    height: `${s.size}px`,
                    animationDelay: s.delay,
                    boxShadow: '0 0 6px 2px rgba(255,255,255,0.3)',
                  }}
                />
              ))}
            </div>

            {/* ===== LEFT: Main ticket body (pastel rose) ===== */}
            <div className="flex-1 bg-[#F5E1E0] relative overflow-hidden">

              {/* Diagonal decorative accent */}
              <div className="absolute -right-8 top-0 bottom-0 w-40 opacity-[0.04] pointer-events-none">
                <div className="absolute inset-0 bg-[#C73E3A]" style={{ clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 0% 100%)' }} />
              </div>

              <div className="relative p-5 md:p-7 flex flex-col justify-between h-full min-h-[280px] md:min-h-[320px]">

                {/* Top: Presenter line */}
                <div>
                  <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#C73E3A]/40 font-sans font-medium">
                    Geburtstags-Gutschein presents
                  </p>
                </div>

                {/* Center: Show title + venue */}
                <div className="my-4 md:my-6">
                  <h3 className="text-5xl md:text-7xl font-black text-[#8B2D2D] leading-none tracking-tight" style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
                    MJ
                  </h3>
                  <p className="text-sm md:text-base font-bold text-[#8B2D2D]/80 mt-1 uppercase tracking-wide">
                    Das Michael Jackson Musical
                  </p>
                  <div className="mt-4 space-y-1">
                    <p className="text-xs md:text-sm text-[#8B2D2D]/50 font-sans">
                      Stage Theater an der Elbe
                    </p>
                    <p className="text-xs md:text-sm text-[#8B2D2D]/50 font-sans">
                      Hamburg
                    </p>
                  </div>
                </div>

                {/* Bottom: Details grid */}
                <div>
                  <div className="border-t border-[#C73E3A]/12 pt-4 grid grid-cols-3 gap-x-4">
                    <div>
                      <p className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-[#8B2D2D]/30 font-sans">Datum</p>
                      <p className="text-xs md:text-sm font-bold text-[#8B2D2D]/75 mt-0.5">Nach Wahl</p>
                    </div>
                    <div>
                      <p className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-[#8B2D2D]/30 font-sans">Anzahl</p>
                      <p className="text-xs md:text-sm font-bold text-[#8B2D2D]/75 mt-0.5">2 Tickets</p>
                    </div>
                    <div>
                      <p className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-[#8B2D2D]/30 font-sans">Kategorie</p>
                      <p className="text-xs md:text-sm font-bold text-[#8B2D2D]/75 mt-0.5">Beste Plätze</p>
                    </div>
                  </div>

                  {/* Fine print */}
                  <div className="mt-4 pt-3 border-t border-[#C73E3A]/8">
                    <p className="text-[9px] md:text-[10px] text-[#8B2D2D]/30 font-sans leading-relaxed">
                      Die Reiseplanung erfolgt durch den Unterhaltungsmanager Roman Halisch.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== Perforation line (vertical tear) ===== */}
            <div className="relative w-0 flex-shrink-0">
              {/* Top notch */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-3 bg-cream rounded-b-full z-30" />
              {/* Bottom notch */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-3 bg-cream rounded-t-full z-30" />
              {/* Dashed line */}
              <div className="absolute inset-y-3 left-1/2 -translate-x-1/2 w-px border-l border-dashed border-[#C73E3A]/15 z-30" />
            </div>

            {/* ===== RIGHT: Stub / tear-off section (slightly darker rose) ===== */}
            <div className="w-28 md:w-36 bg-[#EDDCDB] relative overflow-hidden flex-shrink-0">

              <div className="relative p-4 md:p-5 flex flex-col items-center justify-between h-full text-center min-h-[280px] md:min-h-[320px]">

                {/* Top: event type */}
                <div>
                  <p className="text-[8px] md:text-[9px] uppercase tracking-[0.25em] text-[#8B2D2D]/30 font-sans">
                    Musical
                  </p>
                  <p className="text-[8px] md:text-[9px] uppercase tracking-[0.25em] text-[#8B2D2D]/30 font-sans mt-0.5">
                    Gutschein
                  </p>
                </div>

                {/* Center: Big MJ */}
                <div>
                  <p className="text-3xl md:text-4xl font-black text-[#8B2D2D]/70" style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
                    MJ
                  </p>
                  <div className="w-6 h-px bg-[#C73E3A]/15 mx-auto my-2" />
                  <p className="text-[9px] md:text-[10px] text-[#8B2D2D]/40 font-sans uppercase tracking-wider">
                    Hamburg
                  </p>
                </div>

                {/* Bottom: Gast */}
                <div>
                  <p className="text-[8px] md:text-[9px] uppercase tracking-[0.15em] text-[#8B2D2D]/25 font-sans">
                    Gast
                  </p>
                  <p className="text-xs md:text-sm font-bold text-[#8B2D2D]/60 mt-0.5">
                    Mama
                  </p>

                  {/* Decorative barcode-like lines */}
                  <div className="flex items-end justify-center gap-[2px] mt-3 h-6 opacity-20">
                    {[3,5,2,4,6,2,5,3,4,6,2,3,5,4,2,6,3,5].map((h, i) => (
                      <div key={i} className="bg-[#8B2D2D]" style={{ width: '1.5px', height: `${h * 3.5}px` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unterhaltungsmanager card */}
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
          {/* Subtle seigaiha corner accent */}
          <svg className="absolute -top-2 -right-2 w-20 h-20 opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="seigaiha-mgr" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="9" fill="none" stroke="#C73E3A" strokeWidth="0.5" />
                <circle cx="10" cy="10" r="6" fill="none" stroke="#C73E3A" strokeWidth="0.5" />
                <circle cx="10" cy="10" r="3" fill="none" stroke="#C73E3A" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#seigaiha-mgr)" />
          </svg>

          <p className="font-serif text-base md:text-lg text-charcoal/70 leading-relaxed mb-2">
            Dein Unterhaltungsmanager
          </p>
          <p className="font-serif text-xl md:text-2xl text-charcoal tracking-tight mb-3">
            Roman Halisch
          </p>
          <div className="h-px w-16 mx-auto bg-[#C73E3A]/15 mb-3" />
          <p className="font-sans text-xs md:text-sm text-charcoal/40 leading-relaxed">
            Die genaue Reiseplanung erfolgt durch den<br />
            Unterhaltungsmanager persönlich.
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
