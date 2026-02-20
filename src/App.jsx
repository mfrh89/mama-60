import { useState } from 'react'
import Hero from './components/Hero'
import FlightTicket from './components/FlightTicket'
import SushiReveal from './components/SushiReveal'
import BirthdayWishes from './components/BirthdayWishes'
import MusicToggle from './components/MusicToggle'
import LoginScreen from './components/LoginScreen'
import GuestWishForm from './components/GuestWishForm'
import AdminPanel from './components/AdminPanel'
import MoreGiftsIntro from './components/MoreGifts'
import MasonryGallery from './components/MasonryGallery'
import MusicalTicket from './components/MusicalTicket'
import BowieGift from './components/BowieGift'
import { motion } from 'framer-motion'
import content from './content.json'

export default function App() {
  const { footer } = content
  const [role, setRole] = useState(null)       // null | 'mama' | 'guest' | 'admin'
  const [guestDone, setGuestDone] = useState(false)

  // Not logged in — show login screen
  if (!role) {
    return <LoginScreen onLogin={setRole} />
  }

  // Admin panel
  if (role === 'admin') {
    return <AdminPanel />
  }

  // Guest who hasn't submitted their wish yet
  if (role === 'guest' && !guestDone) {
    return <GuestWishForm onComplete={() => setGuestDone(true)} />
  }

  // Main site — visible to mama always, and to guests after submitting
  return (
    <div className="min-h-screen bg-cream">
      <MusicToggle />

      <Hero />
      <FlightTicket />
      <SushiReveal />
      <MasonryGallery />
      <MoreGiftsIntro />
      <MusicalTicket />
      <BowieGift />
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
            {footer.message}
          </p>
          <p className="font-sans text-xs text-charcoal/30 mt-4 tracking-wide">
            {footer.tagline}
          </p>
        </motion.div>
      </footer>
    </div>
  )
}
