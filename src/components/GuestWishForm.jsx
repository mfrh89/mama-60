import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase'

export default function GuestWishForm({ onComplete }) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const fileRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    setSubmitting(true)

    try {
      let imageUrl = null

      if (image) {
        const ext = image.name.split('.').pop()
        const storageRef = ref(storage, `wishes/${Date.now()}_${name.trim()}.${ext}`)
        await uploadBytes(storageRef, image)
        imageUrl = await getDownloadURL(storageRef)
      }

      await addDoc(collection(db, 'wishes'), {
        name: name.trim(),
        message: message.trim(),
        imageUrl,
        createdAt: serverTimestamp(),
      })

      setSubmitted(true)
      setTimeout(() => onComplete(), 2000)
    } catch (err) {
      console.error('Error submitting wish:', err)
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-4xl text-[#C73E3A]/20 select-none block mb-6">感謝</span>
          <h2 className="font-serif text-2xl md:text-3xl text-charcoal tracking-tight mb-3">
            Vielen Dank, {name}!
          </h2>
          <p className="font-sans text-sm text-charcoal/45">
            Dein Geburtstagswunsch wurde gespeichert.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Seigaiha background */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.025] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="seigaiha-form" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="18" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
            <circle cx="20" cy="20" r="14" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
            <circle cx="20" cy="20" r="10" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
            <circle cx="0" cy="20" r="18" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
            <circle cx="0" cy="20" r="14" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
            <circle cx="0" cy="20" r="10" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
            <circle cx="40" cy="20" r="18" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
            <circle cx="40" cy="20" r="14" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
            <circle cx="40" cy="20" r="10" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#seigaiha-form)" />
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative"
      >
        {/* Decorative top */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C73E3A]/20" />
          <span className="text-lg text-[#C73E3A]/20 select-none">願</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C73E3A]/20" />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl md:text-3xl text-charcoal tracking-tight mb-2">
            Geburtstagswunsch
          </h1>
          <p className="font-sans text-xs text-charcoal/40 leading-relaxed">
            Hinterlasse einen persönlichen Gruß für das Geburtstagskind
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-charcoal/35 font-sans mb-2">
              Dein Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Vor- und Nachname"
              required
              className="w-full bg-white/50 border border-charcoal/10 rounded-sm px-4 py-3 font-sans text-base text-charcoal placeholder:text-charcoal/25 focus:outline-none focus:border-charcoal/25 transition-colors"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-charcoal/35 font-sans mb-2">
              Deine Nachricht
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Schreibe deinen Geburtstagswunsch..."
              required
              rows={4}
              className="w-full bg-white/50 border border-charcoal/10 rounded-sm px-4 py-3 font-sans text-base text-charcoal placeholder:text-charcoal/25 focus:outline-none focus:border-charcoal/25 transition-colors resize-none"
            />
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-charcoal/35 font-sans mb-2">
              Bild <span className="normal-case tracking-normal text-charcoal/25">(optional)</span>
            </label>

            {imagePreview ? (
              <div className="relative group">
                <img
                  src={imagePreview}
                  alt="Vorschau"
                  className="w-full h-40 object-cover rounded-sm border border-charcoal/10"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 border border-charcoal/10 flex items-center justify-center text-charcoal/40 hover:text-charcoal/70 text-xs transition-colors"
                >
                  &times;
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full border border-dashed border-charcoal/15 rounded-sm py-8 flex flex-col items-center gap-2 hover:border-charcoal/25 transition-colors"
              >
                <svg className="w-5 h-5 text-charcoal/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m-4 4h8m-4-9a9 9 0 110 18 9 9 0 010-18z" />
                </svg>
                <span className="font-sans text-xs text-charcoal/30">Bild auswählen</span>
              </button>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !name.trim() || !message.trim()}
            className="w-full bg-[#F1C5C1] hover:bg-[#E5B4B0] disabled:opacity-40 disabled:hover:bg-[#F1C5C1] text-charcoal border border-[#F1C5C1] rounded-sm py-4 font-sans text-sm font-medium tracking-[0.15em] transition-all shadow-md hover:shadow-lg hover:scale-[1.02] disabled:hover:scale-100"
          >
            {submitting ? 'Wird gesendet...' : 'Wunsch absenden'}
          </button>

          {/* Skip Button */}
          <button
            type="button"
            onClick={onComplete}
            className="w-full py-3 font-sans text-sm text-charcoal/60 hover:text-charcoal font-medium tracking-[0.1em] transition-all hover:underline underline-offset-4"
          >
            Überspringen
          </button>
        </form>

        {/* Decorative bottom */}
        <div className="flex items-center justify-center mt-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C73E3A]/15" />
          <svg className="w-4 h-4 mx-2 text-[#C73E3A]/12" viewBox="0 0 48 48" fill="currentColor">
            <ellipse cx="24" cy="14" rx="4" ry="8" transform="rotate(0 24 24)" />
            <ellipse cx="24" cy="14" rx="4" ry="8" transform="rotate(72 24 24)" />
            <ellipse cx="24" cy="14" rx="4" ry="8" transform="rotate(144 24 24)" />
            <ellipse cx="24" cy="14" rx="4" ry="8" transform="rotate(216 24 24)" />
            <ellipse cx="24" cy="14" rx="4" ry="8" transform="rotate(288 24 24)" />
            <circle cx="24" cy="24" r="2.5" />
          </svg>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C73E3A]/15" />
        </div>
      </motion.div>
    </div>
  )
}
