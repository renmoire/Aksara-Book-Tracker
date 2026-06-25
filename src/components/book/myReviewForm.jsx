'use client'

import { useState } from 'react'
import { upsertReview } from '@/src/lib/reviews'
import StarRating from './starRating'

export default function MyReviewForm({ bookId, userId, existingReview, onSaved }) {
  const [rating, setRating]       = useState(existingReview?.rating || 0)
  const [reviewText, setReviewText] = useState(existingReview?.review_text || '')
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')
  const [saved, setSaved]         = useState(false)

  const handleSubmit = async () => {
    if (!rating) { setError('Pilih rating dulu ya.'); return }
    setSaving(true)
    setError('')

    const { data, error: err } = await upsertReview({ bookId, userId, rating, reviewText })
    setSaving(false)

    if (err) { setError('Gagal menyimpan review.'); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    onSaved?.(data)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-3">
      <p className="text-[13.5px] font-semibold text-gray-900">Reviewmu</p>

      <div className="flex items-center gap-2">
        <StarRating value={rating} onChange={(n) => { setRating(n); setSaved(false) }} />
        {rating > 0 && (
          <span className="text-[12px] text-gray-400">
            {['', 'Tidak suka', 'Biasa aja', 'Lumayan', 'Suka', 'Luar biasa'][rating]}
          </span>
        )}
      </div>

      <textarea
        value={reviewText}
        onChange={(e) => { setReviewText(e.target.value); setSaved(false) }}
        placeholder="Tulis reviewmu... (opsional)"
        rows={3}
        className="w-full resize-none border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] text-gray-700 outline-none focus:border-[#1a2332] transition-colors placeholder:text-gray-300"
      />

      {error && <p className="text-[11.5px] text-red-500">{error}</p>}

      <div className="flex items-center justify-between">
        {saved && <p className="text-[12px] text-green-600">Tersimpan!</p>}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="ml-auto px-4 py-2 bg-[#1a2332] text-white text-[13px] font-medium rounded-lg hover:bg-[#243044] disabled:opacity-50 transition-colors"
        >
          {saving ? 'Menyimpan...' : existingReview ? 'Perbarui review' : 'Simpan review'}
        </button>
      </div>
    </div>
  )
}