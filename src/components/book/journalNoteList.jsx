'use client'

import { useState } from 'react'
import { addJournalNote, deleteJournalNote } from '@/src/lib/journalNotes'

/**
 * JournalNoteList
 * Catatan teks bebas dari user (beda dari reading_history yang track halaman).
 * props:
 * - notes: [{ id, body, created_at }]
 * - userBookId, userId
 * - onNotesChanged: () => void  — trigger reload di parent
 */
export default function JournalNoteList({ notes = [], userBookId, userId, onNotesChanged }) {
  const [open, setOpen]   = useState(false)
  const [body, setBody]   = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleAdd = async () => {
    if (!body.trim()) return
    setSaving(true)
    setError('')

    const { error: err } = await addJournalNote({ userBookId, userId, body: body.trim() })
    setSaving(false)

    if (err) { setError('Gagal menyimpan catatan.'); return }
    setBody('')
    setOpen(false)
    onNotesChanged?.()
  }

  const handleDelete = async (noteId) => {
    const { error: err } = await deleteJournalNote(noteId)
    if (!err) onNotesChanged?.()
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Tombol buka form */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-800 transition-colors self-start"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah catatan
        </button>
      )}

      {/* Form tambah catatan */}
      {open && (
        <div className="flex flex-col gap-2">
          <textarea
            autoFocus
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Tulis catatanmu di sini..."
            rows={3}
            className="w-full resize-none border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] text-gray-700 outline-none focus:border-[#1a2332] transition-colors placeholder:text-gray-300"
          />
          {error && <p className="text-[11.5px] text-red-500">{error}</p>}
          <div className="flex gap-2 self-end">
            <button
              type="button"
              onClick={() => { setOpen(false); setBody('') }}
              className="px-3.5 py-1.5 text-[13px] text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={saving || !body.trim()}
              className="px-3.5 py-1.5 bg-[#1a2332] text-white text-[13px] font-medium rounded-lg hover:bg-[#243044] disabled:opacity-50 transition-colors"
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      )}

      {/* Daftar catatan */}
      {notes.length === 0 && !open ? (
        <p className="text-[13px] text-gray-400 text-center py-6 border border-dashed border-gray-200 rounded-2xl">
          Belum ada catatan. Tulis kesan, kutipan favorit, atau apapun tentang buku ini.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {notes.map((note) => (
            <div key={note.id} className="group relative bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-[11.5px] text-gray-400 mb-1.5">
                {new Date(note.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
              <p className="text-[13.5px] text-gray-700 leading-relaxed whitespace-pre-wrap">{note.body}</p>
              <button
                type="button"
                onClick={() => handleDelete(note.id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all"
                aria-label="Hapus catatan"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}