import { useState, useRef, useEffect } from 'react'

export default function MusicToggle() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasAudio, setHasAudio] = useState(true)
  const audioRef = useRef(null)

  useEffect(() => {
    // Create audio element
    const audio = new Audio()
    // Use a silent fallback — the user should add their own music file
    // at src/assets/music/ambient.mp3
    audio.loop = true
    audio.volume = 0.3

    // Try to load the music file
    // Place your own ambient.mp3 in src/assets/music/
    try {
      audio.src = /* @vite-ignore */ new URL('../assets/music/ambient.mp3', import.meta.url).href
    } catch {
      setHasAudio(false)
      return
    }

    audio.addEventListener('error', () => {
      setHasAudio(false)
    })

    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  const toggleMusic = () => {
    if (!audioRef.current || !hasAudio) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {
        // Autoplay blocked
        setHasAudio(false)
      })
    }
    setIsPlaying(!isPlaying)
  }

  // Don't render if no audio file
  if (!hasAudio) return null

  return (
    <button
      onClick={toggleMusic}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-sakura-pink/30 flex items-center justify-center hover:bg-sakura-light transition-colors duration-200 group"
      aria-label={isPlaying ? 'Musik pausieren' : 'Musik abspielen'}
      title={isPlaying ? 'Musik pausieren' : 'Musik abspielen'}
    >
      {isPlaying ? (
        /* Pause icon */
        <svg
          className="w-5 h-5 text-sakura-dark group-hover:text-charcoal transition-colors"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
        </svg>
      ) : (
        /* Play / music note icon */
        <svg
          className="w-5 h-5 text-sakura-dark group-hover:text-charcoal transition-colors"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      )}

      {/* Animated rings when playing */}
      {isPlaying && (
        <>
          <span className="absolute inset-0 rounded-full border border-sakura-pink/50 animate-ping" style={{ animationDuration: '2s' }} />
        </>
      )}
    </button>
  )
}
