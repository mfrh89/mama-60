import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import content from '../content.json'


function WishCard({ wish, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="bg-white/60 backdrop-blur-sm rounded-lg p-6 md:p-8 border border-charcoal/5 relative z-10"
      role="listitem"
    >
      {/* Guest-uploaded image */}
      {wish.imageUrl && (
        <img
          src={wish.imageUrl}
          alt={`Bild von ${wish.name}`}
          className="w-full h-40 object-cover rounded-md mb-4 border border-charcoal/5"
        />
      )}

      <p className="font-sans text-charcoal/65 text-sm md:text-base leading-relaxed mb-6">
        {wish.message}
      </p>
      <div className="flex items-center gap-3 pt-4 border-t border-charcoal/5">
        <div className="w-8 h-8 rounded-full bg-charcoal/5 flex items-center justify-center text-charcoal/40 font-sans text-xs font-medium">
          {wish.name.charAt(0)}
        </div>
        <div>
          <p className="font-sans font-medium text-charcoal text-sm">{wish.name}</p>
          {wish.relation && (
            <p className="font-sans text-charcoal/35 text-xs">{wish.relation}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function BirthdayWishes() {
  const { birthdayWishes } = content
  const [firestoreWishes, setFirestoreWishes] = useState([])

  useEffect(() => {
    const q = query(collection(db, 'wishes'), orderBy('createdAt', 'asc'))
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setFirestoreWishes(docs)
    }, (err) => {
      console.error('Error loading wishes:', err)
    })
    return unsub
  }, [])

  const allWishes = firestoreWishes

  if (allWishes.length === 0) return null

  return (
    <section className="py-24 md:py-32 px-4 md:px-8 relative overflow-hidden" aria-labelledby="wishes-title">
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 md:mb-16"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-charcoal/35 font-sans mb-4">
          {birthdayWishes.label}
        </p>
        <h2 id="wishes-title" className="font-serif text-2xl md:text-3xl text-charcoal tracking-tight">
          {birthdayWishes.title}
        </h2>
      </motion.div>

      {/* Wishes grid */}
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative z-10" role="list" aria-label="Geburtstagswünsche">
        {allWishes.map((wish, index) => (
          <WishCard key={wish.id} wish={wish} index={index} />
        ))}
      </div>
    </section>
  )
}
