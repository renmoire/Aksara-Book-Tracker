'use client'

import { useState } from 'react'

/**
 * ProgressUpdateForm
 * -------------------
 * Form kecil untuk update halaman terakhir yang dibaca.
 * props:
 * - currentPage, totalPages
 * - onSubmit: (newPage) => Promise<void>
 */
export default function ProgressUpdateForm({ currentPage = 0, totalPages = 0, onSubmit }) {
  const [newPage, setNewPage] = useState(currentPage)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const percent = totalPages > 0 ? Math.min(100, Math.round((currentPage / totalPages) * 100)) : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const pageNum = Number(newPage)

    if (Number.isNaN(pageNum) || pageNum < 0) {
      setError('Masukkan nomor halaman yang valid.')
      return
    }
    if (totalPages > 0 && pageNum > totalPages) {
      setError(`Halaman tidak boleh lebih dari ${totalPages}.`)
      return
    }
    if (pageNum < currentPage) {
      setError('Halaman baru harus lebih besar dari halaman sebelumnya.')
      return
    }

    setSaving(true)
    await onSubmit(pageNum)
    setSaving(false)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[13.5px] font-semibold text-gray-900">Progress Membaca</p>
        <span className="text-[12px] text-gray-500">{percent}%</span>
      </div>

      <div className="h-2 rounded-full bg-gray-100 overflow-hidden mb-1.5">
        <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${percent}%` }} />
      </div>
      <p className="text-[11.5px] text-gray-400 mb-4">
        Halaman {currentPage} dari {totalPages || '?'}
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="number"
          min={currentPage}
          max={totalPages || undefined}
          value={newPage}
          onChange={(e) => setNewPage(e.target.value)}
          placeholder="Halaman sekarang"
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:border-orange-400"
        />
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-[#1a2332] text-white text-[13px] font-medium rounded-lg hover:bg-[#243044] disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          {saving ? 'Menyimpan...' : 'Update'}
        </button>
      </form>

      {error && <p className="text-[12px] text-red-600 mt-2">{error}</p>}
    </div>
  )
}