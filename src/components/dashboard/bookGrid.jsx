'use client'

import { useState } from 'react'
import BookCard from './bookCard'

/**
 * BookGrid
 * --------
 * props:
 * - title: judul section, misal "Sedang Dibaca"
 * - books: array book object (lihat BookCard)
 * - layout: "scroll-wide" (rak sedang dibaca, horizontal scroll, card wide)
 *          | "grid"        (rekomendasi, grid kolom, card grid)
 * - onSeeAll, onBookClick
 * - limit: jika diisi dan books.length > limit, hanya tampil sejumlah `limit`
 *          dulu. Tombol "Lihat semua" akan expand semua buku di tempat
 *          (tidak memanggil onSeeAll). Tanpa prop ini, behavior lama dipakai.
 * - showStatus: jika true, setiap BookCard menampilkan StatusDropdown
 *               (memakai book.status). Tanpa ini, card tampil seperti biasa.
 * - onChangeStatus, onRemove, busyBookId: diteruskan ke BookCard untuk
 *               interaksi ubah status / hapus dari rak.
 */
export default function BookGrid({
  title,
  books = [],
  layout = 'grid',
  onSeeAll,
  onBookClick,
  limit,
  showStatus,
  onChangeStatus,
  onRemove,
  busyBookId,
}) {
  const [expanded, setExpanded] = useState(false)

  const hasLimit = typeof limit === 'number' && books.length > limit
  const visibleBooks = hasLimit && !expanded ? books.slice(0, limit) : books

  function handleSeeAll() {
    if (hasLimit) {
      setExpanded(true)
    } else if (onSeeAll) {
      onSeeAll()
    }
  }

  const showButton = hasLimit ? !expanded : Boolean(onSeeAll)

  return (
    <section>
      <div className="flex items-baseline justify-between mb-3.5">
        <h2 className="text-[19px] font-serif text-gray-900">{title}</h2>
        {showButton && (
          <button
            type="button"
            onClick={handleSeeAll}
            className="text-[12.5px] font-semibold text-orange-600 hover:underline"
          >
            Lihat semua
          </button>
        )}
      </div>

      {books.length === 0 ? (
        <p className="text-[13px] text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-2xl">
          Belum ada buku di sini.
        </p>
      ) : layout === 'scroll-wide' ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {visibleBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              variant="wide"
              onClick={onBookClick}
              status={showStatus ? book.status : undefined}
              onChangeStatus={onChangeStatus}
              onRemove={onRemove}
              statusBusy={busyBookId === book.id}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-x-4 gap-y-4.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
          {visibleBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              variant="grid"
              onClick={onBookClick}
              status={showStatus ? book.status : undefined}
              onChangeStatus={onChangeStatus}
              onRemove={onRemove}
              statusBusy={busyBookId === book.id}
            />
          ))}
        </div>
      )}
    </section>
  )
}