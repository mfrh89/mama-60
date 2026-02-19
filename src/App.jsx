import Hero from './components/Hero'
import FlightTicket from './components/FlightTicket'
import SushiReveal from './components/SushiReveal'
import BirthdayWishes from './components/BirthdayWishes'
import MusicToggle from './components/MusicToggle'
import { motion } from 'framer-motion'

export default function App() {
  return (
    <div className="min-h-screen bg-cream">
      <MusicToggle />

      <Hero />
      <FlightTicket />
      <SushiReveal />
      <BirthdayWishes />

      {/* Footer */}
      <footer className="py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="w-8 h-px bg-charcoal/15 mx-auto mb-8" />

          <p className="font-serif text-lg md:text-xl text-charcoal/70 mb-2">
            Mit ganz viel Liebe, deine Familie
          </p>
          <p className="font-sans text-xs text-charcoal/30 mt-4 tracking-wide">
            60 Jahre voller wunderbarer Erinnerungen
          </p>
        </motion.div>
      </footer>
    </div>
  )
}
