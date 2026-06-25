'use client'

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
 */
export default function BookGrid({ title, books = [], layout = 'grid', onSeeAll, onBookClick }) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-3.5">
        <h2 className="text-[19px] font-serif text-gray-900">{title}</h2>
        {onSeeAll && (
          <button
            type="button"
            onClick={onSeeAll}
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
          {books.map((book) => (
            <BookCard key={book.id} book={book} variant="wide" onClick={onBookClick} />
          ))}
        </div>
      ) : (
        <div className="grid gap-x-4 gap-y-4.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
          {books.map((book) => (
            <BookCard key={book.id} book={book} variant="grid" onClick={onBookClick} />
          ))}
        </div>
      )}
    </section>
  )
}