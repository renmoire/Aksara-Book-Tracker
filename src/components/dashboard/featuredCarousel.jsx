'use client'

/**
 * FeaturedCarousel
 * -----------------
 * Kartu besar di bagian atas dashboard, untuk highlight buku yang sudah diberi
 * rating oleh user. Cover asli tampil tajam di kiri, sementara seluruh kartu
 * memakai cover yang sama sebagai backdrop blur untuk warna ambient.
 *
 * props:
 * - books: [{ id, title, author, coverUrl, rating, reviewText? }]
 */
export default function FeaturedCarousel({ title = 'Rilis Terbaru', books = [], onBookClick }) {
  if (books.length === 0) return null

  return (
    <section>
      <div className="flex items-baseline justify-between mb-3.5">
        <h2 className="text-[19px] font-serif text-gray-900 font-medium">{title}</h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-1">
        {books.map((book) => (
          <button
            type="button"
            key={book.id}
            onClick={() => onBookClick?.(book)}
            className="min-w-[380px] max-w-[420px] rounded-md overflow-hidden relative h-[200px] flex items-center gap-5 p-5 shrink-0 bg-gray-800 text-left hover:opacity-95 transition-opacity"
          >
            {/* Backdrop: cover yang sama, di-blur jadi warna ambient penuh kartu */}
            {book.coverUrl && (
              <div
                className="absolute inset-0 scale-79"
                style={{
                  backgroundImage: `url(${book.coverUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(17px) saturate(1.3)',
                }}
              />
            )}
            {/* Overlay gradient tipis, hanya untuk pastikan kontras teks */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/20 to-white/39" />

            {/* Cover tajam di kiri */}
            <div className="relative z-10 w-[100px] h-[148px] rounded-md overflow-hidden shrink-0 shadow-lg bg-orange-50 flex items-center justify-center">
              {book.coverUrl ? (
                <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-serif text-orange-700">{book.title?.charAt(0)}</span>
              )}
            </div>

            {/* Info */}
            <div className="relative z-10 flex-1 min-w-0">
              <p className="text-[18px] font-semibold text-white line-clamp-1 leading-snug">
                {book.title}
              </p>
              <p className="text-[13.5px] text-white/80 truncate mt-0.5">{book.author}</p>

              {typeof book.rating === 'number' && (
                <div className="mt-2.5 text-[17px] tracking-wide">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < book.rating ? 'text-orange-400' : 'text-white/25'}>
                      ★
                    </span>
                  ))}
                </div>
              )}

              {book.reviewText && (
                <p className="text-[12.5px] text-white/75 mt-2.5 line-clamp-3 leading-relaxed">
                  {book.reviewText}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}