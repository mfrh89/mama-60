import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { db, storage } from '../firebase'

function WishRow({ wish, onEdit, onDelete }) {
  return (
    <div className="bg-white/60 border border-charcoal/8 rounded-md p-5 space-y-3">
      {/* Header: name + actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-charcoal/5 flex items-center justify-center text-charcoal/40 font-sans text-xs font-medium">
            {wish.name.charAt(0)}
          </div>
          <span className="font-sans font-medium text-charcoal text-sm">{wish.name}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(wish)}
            className="font-sans text-xs text-charcoal/40 hover:text-charcoal/70 border border-charcoal/10 rounded px-3 py-1.5 transition-colors"
          >
            Bearbeiten
          </button>
          <button
            onClick={() => onDelete(wish)}
            className="font-sans text-xs text-[#C73E3A]/50 hover:text-[#C73E3A]/80 border border-[#C73E3A]/15 rounded px-3 py-1.5 transition-colors"
          >
            Löschen
          </button>
        </div>
      </div>

      {/* Message */}
      <p className="font-sans text-sm text-charcoal/60 leading-relaxed">{wish.message}</p>

      {/* Image */}
      {wish.imageUrl && (
        <img src={wish.imageUrl} alt="" className="w-full h-32 object-cover rounded-md border border-charcoal/5" />
      )}
    </div>
  )
}

function EditModal({ wish, onSave, onCancel }) {
  const [name, setName] = useState(wish.name)
  const [message, setMessage] = useState(wish.message)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onSave(wish.id, { name: name.trim(), message: message.trim() })
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-charcoal/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-cream border border-charcoal/10 rounded-md p-6 w-full max-w-md space-y-4">
        <h3 className="font-serif text-lg text-charcoal">Wunsch bearbeiten</h3>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.15em] text-charcoal/35 font-sans mb-1.5">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/50 border border-charcoal/10 rounded-sm px-4 py-2.5 font-sans text-sm text-charcoal focus:outline-none focus:border-charcoal/25 transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.15em] text-charcoal/35 font-sans mb-1.5">Nachricht</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full bg-white/50 border border-charcoal/10 rounded-sm px-4 py-2.5 font-sans text-sm text-charcoal focus:outline-none focus:border-charcoal/25 transition-colors resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving || !name.trim() || !message.trim()}
            className="flex-1 bg-charcoal/5 hover:bg-charcoal/10 disabled:opacity-40 border border-charcoal/8 rounded-sm py-2.5 font-sans text-sm text-charcoal/60 transition-colors"
          >
            {saving ? 'Speichern...' : 'Speichern'}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border border-charcoal/8 rounded-sm py-2.5 font-sans text-sm text-charcoal/40 hover:text-charcoal/60 transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminPanel() {
  const [wishes, setWishes] = useState([])
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'wishes'), orderBy('createdAt', 'asc'))
    const unsub = onSnapshot(q, (snapshot) => {
      setWishes(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [])

  const handleSave = async (id, data) => {
    await updateDoc(doc(db, 'wishes', id), data)
    setEditing(null)
  }

  const handleDelete = async (wish) => {
    setDeleting(wish.id)
    try {
      // Delete image from storage if exists
      if (wish.imageUrl) {
        try {
          // Extract storage path from URL
          const url = new URL(wish.imageUrl)
          const path = decodeURIComponent(url.pathname.split('/o/')[1]?.split('?')[0])
          if (path) await deleteObject(ref(storage, path))
        } catch {
          // Image might already be deleted, continue
        }
      }
      await deleteDoc(doc(db, 'wishes', wish.id))
    } catch (err) {
      console.error('Error deleting wish:', err)
    }
    setDeleting(null)
  }

  return (
    <div className="min-h-screen bg-cream px-4 py-12">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-charcoal/30 font-sans mb-2">管理</p>
          <h1 className="font-serif text-2xl md:text-3xl text-charcoal tracking-tight">
            Admin Panel
          </h1>
          <p className="font-sans text-xs text-charcoal/35 mt-2">
            {wishes.length} {wishes.length === 1 ? 'Wunsch' : 'Wünsche'} gespeichert
          </p>
        </div>

        {/* Wish list */}
        {wishes.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-sans text-sm text-charcoal/30">Noch keine Wünsche vorhanden.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {wishes.map((wish) => (
              <WishRow
                key={wish.id}
                wish={wish}
                onEdit={setEditing}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Edit modal */}
        {editing && (
          <EditModal
            wish={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}
      </div>
    </div>
  )
}
