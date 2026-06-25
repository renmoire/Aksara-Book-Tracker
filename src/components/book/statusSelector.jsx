'use client'

import { useState } from 'react'
import { updateBookStatus, BOOK_STATUS } from '@/src/lib/userBooks'

const STATUS_OPTIONS = [
  { value: BOOK_STATUS.WANT_TO_READ,    label: 'Mau dibaca' },
  { value: BOOK_STATUS.CURRENT_READING, label: 'Sedang dibaca' },
  { value: BOOK_STATUS.FINISHED,        label: 'Selesai' },
]

export default function StatusSelector({ userBookId, currentStatus, onStatusChanged }) {
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const handleChange = async (e) => {
    const newStatus = e.target.value
    setSaving(true)
    setError('')

    const { error: err } = await updateBookStatus(userBookId, newStatus)
    setSaving(false)

    if (err) { setError('Gagal mengubah status.'); return }
    onStatusChanged?.(newStatus)
  }

  const isReading = currentStatus === BOOK_STATUS.CURRENT_READING

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
        Status bacaan
      </label>
      <div className="relative">
        <select
          value={currentStatus}
          onChange={handleChange}
          disabled={saving}
          className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] text-gray-800 pr-8 outline-none focus:border-[#1a2332] transition-colors disabled:opacity-60 cursor-pointer"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      {!isReading && !saving && (
        <p className="text-[11.5px] text-gray-400">
          Set ke <span className="font-medium">Sedang dibaca</span> untuk bisa update progress.
        </p>
      )}
      {error && <p className="text-[11.5px] text-red-500">{error}</p>}
    </div>
  )
}