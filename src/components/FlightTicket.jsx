import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function FlightTicket() {
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
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="ticket-section min-h-screen flex flex-col items-center justify-center py-24 px-4 relative"
    >
      <h2 className="font-serif text-2xl md:text-3xl text-charcoal/80 text-center mb-16 tracking-wide">
        Dein Geschenk wartet...
      </h2>

      {/* 3D Ticket Container */}
      <div className="perspective-container w-full max-w-2xl mx-auto">
        <div
          ref={ticketRef}
          className="ticket-card mx-2 md:mx-4"
          style={{ transformStyle: 'preserve-3d' }}
        >
           {/* Main ticket — long horizontal analogue style */}
          <div className="bg-cream border border-charcoal/10 rounded-sm shadow-xl overflow-hidden relative">

            {/* Seigaiha wave pattern background */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="seigaiha" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="18" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
                  <circle cx="20" cy="20" r="14" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
                  <circle cx="20" cy="20" r="10" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
                  <circle cx="20" cy="20" r="6" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
                  <circle cx="0" cy="20" r="18" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
                  <circle cx="0" cy="20" r="14" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
                  <circle cx="0" cy="20" r="10" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
                  <circle cx="0" cy="20" r="6" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
                  <circle cx="40" cy="20" r="18" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
                  <circle cx="40" cy="20" r="14" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
                  <circle cx="40" cy="20" r="10" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
                  <circle cx="40" cy="20" r="6" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#seigaiha)" />
            </svg>

            {/* Sakura watermark — top right */}
            <svg className="absolute top-3 right-3 w-12 h-12 opacity-[0.07] pointer-events-none" viewBox="0 0 48 48" fill="#C73E3A" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="24" cy="14" rx="5" ry="10" transform="rotate(0 24 24)" />
              <ellipse cx="24" cy="14" rx="5" ry="10" transform="rotate(72 24 24)" />
              <ellipse cx="24" cy="14" rx="5" ry="10" transform="rotate(144 24 24)" />
              <ellipse cx="24" cy="14" rx="5" ry="10" transform="rotate(216 24 24)" />
              <ellipse cx="24" cy="14" rx="5" ry="10" transform="rotate(288 24 24)" />
              <circle cx="24" cy="24" r="3" fill="#C73E3A" />
            </svg>

            {/* Sakura watermark — bottom left */}
            <svg className="absolute bottom-4 left-8 w-8 h-8 opacity-[0.06] pointer-events-none" viewBox="0 0 48 48" fill="#C73E3A" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="24" cy="14" rx="5" ry="10" transform="rotate(15 24 24)" />
              <ellipse cx="24" cy="14" rx="5" ry="10" transform="rotate(87 24 24)" />
              <ellipse cx="24" cy="14" rx="5" ry="10" transform="rotate(159 24 24)" />
              <ellipse cx="24" cy="14" rx="5" ry="10" transform="rotate(231 24 24)" />
              <ellipse cx="24" cy="14" rx="5" ry="10" transform="rotate(303 24 24)" />
              <circle cx="24" cy="24" r="3" fill="#C73E3A" />
            </svg>

            <div className="pl-4 pr-4 relative">
              {/* Header row */}
              <div className="flex items-center justify-between border-b border-charcoal/8 py-4">
                <div className="flex items-center gap-3">
                  {/* Torii gate icon */}
                  <svg className="w-5 h-5 text-[#C73E3A]/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 6h16M6 6v14M18 6v14M3 4h18M8 6v4M16 6v4" strokeLinecap="round" />
                  </svg>
                  <span className="text-xs uppercase tracking-[0.3em] text-charcoal/40 font-sans font-medium">
                    Birthday Airlines
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase tracking-[0.2em] text-charcoal/30 font-sans">
                    Boarding Pass
                  </span>
                  <span className="text-[10px] text-charcoal/20 font-sans ml-2 tracking-wide">
                    搭乗券
                  </span>
                </div>
              </div>

              {/* Main route section */}
              <div className="py-8 md:py-10 flex items-center gap-4 md:gap-8">
                {/* Departure */}
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/40 font-sans mb-1">Von</p>
                  <p className="text-3xl md:text-5xl font-serif font-bold text-charcoal tracking-tight leading-none">MUC</p>
                  <p className="text-xs md:text-sm text-charcoal/50 font-sans mt-1">München</p>
                </div>

                {/* Flight path line */}
                <div className="flex-1 flex items-center px-2">
                  <div className="w-full relative">
                    <div className="h-px bg-[#C73E3A]/15 w-full" />
                    {/* Dots along the path — vermillion */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#C73E3A]/30" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#C73E3A]/30" />
                    {/* Plane icon — above the line */}
                    <svg className="w-4 h-4 text-[#C73E3A]/30 absolute left-1/2 -translate-x-1/2 -top-6 rotate-90" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                    </svg>
                  </div>
                </div>

                {/* Arrival */}
                <div className="flex-1 text-right">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/40 font-sans mb-1">Nach</p>
                  <p className="text-3xl md:text-5xl font-serif font-bold text-charcoal tracking-tight leading-none">NRT</p>
                  <p className="text-xs md:text-sm text-charcoal/50 font-sans mt-1">
                    東京 <span className="text-charcoal/35">· Tokyo</span>
                  </p>
                </div>
              </div>

              {/* Tear line with notches */}
              <div className="relative py-1">
                <div className="border-t border-dashed border-[#C73E3A]/10" />
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-8 bg-white rounded-r-full border-r border-charcoal/8" />
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-8 bg-white rounded-l-full border-l border-charcoal/8" />
              </div>

              {/* Row 1: Passagier, Datum, Flug */}
              <div className="grid grid-cols-3 gap-x-4 md:gap-x-8 py-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-charcoal/35 font-sans">Passagier</p>
                  <p className="text-sm md:text-base font-serif text-charcoal mt-0.5">Mama</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-charcoal/35 font-sans">Datum</p>
                  <p className="text-sm md:text-base font-serif text-charcoal mt-0.5">2027</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-charcoal/35 font-sans">Flug</p>
                  <p className="text-sm md:text-base font-serif text-charcoal mt-0.5">PH 1966</p>
                </div>
              </div>

              {/* Row 2: Klasse, Sitz, Status */}
              <div className="grid grid-cols-3 gap-x-4 md:gap-x-8 pb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-charcoal/35 font-sans">Klasse</p>
                  <p className="text-sm md:text-base font-serif text-charcoal mt-0.5">Premium Economy</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-charcoal/35 font-sans">Sitz</p>
                  <p className="text-sm md:text-base font-serif text-charcoal mt-0.5">1A</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-charcoal/35 font-sans">Status</p>
                  <p className="text-sm md:text-base font-serif text-charcoal mt-0.5">Bestätigt</p>
                </div>
              </div>

              {/* Bottom section with Japanese accent */}
              <div className="border-t border-charcoal/6 py-5 flex items-center justify-between">
                <p className="text-xs text-charcoal/40 font-sans tracking-wide">
                  Eine Reise nach Japan – mit deinen Liebsten!
                </p>
                {/* Japanese character for travel: 旅 */}
                <span className="text-2xl md:text-3xl text-charcoal/8 font-serif select-none">旅</span>
              </div>
            </div>

            {/* Subtle accent strip at bottom — vermillion */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#C73E3A]/15 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
