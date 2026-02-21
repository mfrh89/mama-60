import { useState, useEffect, lazy, Suspense } from 'react'
import Hero from './components/Hero'
import FlightTicket from './components/FlightTicket'
import BirthdayWishes from './components/BirthdayWishes'
import MusicToggle from './components/MusicToggle'
import LoginScreen from './components/LoginScreen'
import AdminPanel from './components/AdminPanel'
import MoreGiftsIntro from './components/MoreGifts'
import MasonryGallery from './components/MasonryGallery'
import MusicalTicket from './components/MusicalTicket'
import BowieGift from './components/BowieGift'
import BirthdayLetter from './components/BirthdayLetter'
import ErrorBoundary from './components/ErrorBoundary'
import { motion } from 'framer-motion'
import content from './content.json'

const SushiReveal = lazy(() => import('./components/SushiReveal'))
const MugReveal = lazy(() => import('./components/MugReveal'))

export default function App() {
  const { footer } = content
  const [role, setRole] = useState(() => localStorage.getItem('mama60_role'))
  const [countdownComplete, setCountdownComplete] = useState(() => {
    // Check if countdown is already complete (after Feb 22, 2026)
    const targetDate = new Date('2026-02-22T00:00:00+01:00')
    return Date.now() >= targetDate.getTime()
  })

  useEffect(() => {
    if (role) {
      localStorage.setItem('mama60_role', role)
    } else {
      localStorage.removeItem('mama60_role')
    }
  }, [role])

  // Admin panel via URL parameter (?admin=true)
  const isAdmin = new URLSearchParams(window.location.search).get('admin') === 'true'
  
  if (isAdmin) {
    return <AdminPanel />
  }

  // If countdown not complete AND no login → show login screen
  if (!countdownComplete && !role) {
    return <LoginScreen onLogin={setRole} onCountdownComplete={() => setCountdownComplete(true)} />
  }

  // Main site — visible to mama always, and to guests after submitting
  return (
    <div className="min-h-screen bg-cream">
      <MusicToggle />

      <main id="main-content">
        <Hero />
        <BirthdayLetter />
        <FlightTicket />
        <ErrorBoundary>
          <Suspense fallback={
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-charcoal/10 border-t-charcoal/30 rounded-full animate-spin" />
            </div>
          }>
            <SushiReveal />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-charcoal/10 border-t-charcoal/30 rounded-full animate-spin" />
            </div>
          }>
            <MugReveal />
          </Suspense>
        </ErrorBoundary>
        <MasonryGallery />
        <MoreGiftsIntro />
        <MusicalTicket />
        <BowieGift />
        <BirthdayWishes />
      </main>

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
