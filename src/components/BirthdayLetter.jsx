import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import content from '../content.json'

gsap.registerPlugin(ScrollTrigger)

const sentence = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: 'easeOut' },
  },
}

const textStyle = { lineHeight: 1.6 }

function GermanOnly({ paragraphs }) {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      {paragraphs.map((sentences, pIdx) => (
        <p
          key={pIdx}
          style={textStyle}
          className={
            pIdx === 0
              ? 'font-serif text-2xl md:text-3xl text-charcoal/80'
              : 'font-serif text-xl md:text-2xl text-charcoal/70'
          }
        >
          {sentences.map((text, sIdx) => (
            <motion.span
              key={sIdx}
              variants={sentence}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-120px' }}
              transition={{ duration: 1.2, delay: 0.8 + sIdx * 0.4, ease: 'easeOut' }}
              className="inline-block"
              style={{ whiteSpace: 'normal', wordBreak: 'normal' }}
            >
              {sIdx > 0 ? ' ' : ''}{text}
            </motion.span>
          ))}
        </p>
      ))}
    </div>
  )
}

function ParagraphPair({ jaLines, deLines, isFirst }) {
  const containerRef = useRef(null)
  const jaRef = useRef(null)
  const deRef = useRef(null)
  const [height, setHeight] = useState(0)

  const measure = useCallback(() => {
    const jaH = jaRef.current?.scrollHeight || 0
    const deH = deRef.current?.scrollHeight || 0
    setHeight(Math.max(jaH, deH))
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  useEffect(() => {
    const container = containerRef.current
    const jaEl = jaRef.current
    const deEl = deRef.current
    if (!container || !jaEl || !deEl) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 70%',
        end: 'top 35%',
        scrub: 1,
      },
    })

    tl.to(jaEl, { opacity: 0, duration: 0.5 })
      .to(deEl, { opacity: 1, duration: 0.5 }, 0.2)

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  const cls = isFirst
    ? 'font-serif text-2xl md:text-3xl text-charcoal/80'
    : 'font-serif text-xl md:text-2xl text-charcoal/70'

  return (
    <div ref={containerRef} className="relative" style={{ height: height || 'auto' }}>
      <p ref={jaRef} style={textStyle} className={`${cls} absolute inset-x-0 top-0`}>
        {jaLines.join('')}
      </p>
      <p ref={deRef} style={{ ...textStyle, opacity: 0 }} className={`${cls} absolute inset-x-0 top-0`}>
        {deLines.join(' ')}
      </p>
    </div>
  )
}

function JapaneseToGerman({ paragraphsJa, paragraphsDe }) {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      {paragraphsJa.map((jaLines, pIdx) => (
        <ParagraphPair
          key={pIdx}
          jaLines={jaLines}
          deLines={paragraphsDe[pIdx] || []}
          isFirst={pIdx === 0}
        />
      ))}
    </div>
  )
}

export default function BirthdayLetter() {
  const { birthdayLetter } = content
  const showJa = birthdayLetter.showJapanese

  return (
    <section className="py-28 md:py-36 px-6 md:px-8 relative overflow-hidden">
      {/* Decorative top */}
      <div className="flex items-center justify-center gap-3 mb-16">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C73E3A]/20" />
        <span className="text-sm text-[#C73E3A]/25 select-none">{birthdayLetter.kanji}</span>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C73E3A]/20" />
      </div>

      {showJa ? (
        <JapaneseToGerman
          paragraphsJa={birthdayLetter.paragraphsJa}
          paragraphsDe={birthdayLetter.paragraphsDe}
        />
      ) : (
        <GermanOnly paragraphs={birthdayLetter.paragraphsDe} />
      )}

      {/* Decorative bottom */}
      <div className="flex items-center justify-center mt-16">
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
    </section>
  )
}
