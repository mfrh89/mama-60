import { motion } from 'framer-motion'
import content from '../content.json'

export default function MoreGiftsIntro() {
  const { moreGifts } = content
  return (
    <section className="pt-24 md:pt-32 pb-8 px-4 md:px-8 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-charcoal/35 font-sans mb-4">
          {moreGifts.label}
        </p>
        <h2 className="font-serif text-2xl md:text-3xl text-charcoal tracking-tight">
          {moreGifts.title}
        </h2>
      </motion.div>
    </section>
  )
}
