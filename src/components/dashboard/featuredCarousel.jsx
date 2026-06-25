'use client'

/**
 * FeaturedCarousel
 * -----------------
 * Kartu besar di bagian atas dashboard, untuk highlight buku pilihan/baru.
 * props:
 * - books: [{ id, title, author, coverUrl, rating, tagline }]
 */
export default function FeaturedCarousel({ title = 'Rilis Terbaru', books = [] }) {
  if (books.length === 0) return null

  return (
    <section>
      <div className="flex items-baseline justify-between mb-3.5">
        <h2 className="text-[19px] font-serif text-gray-900 font-medium">{title}</h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-1">
        {books.map((book) => (
          <div
            key={book.id}
            className="min-w-[220px] rounded-2xl overflow-hidden relative bg-orange-50 h-[150px] flex flex-col justify-end p-4"
            style={
              book.coverUrl
                ? {
                    backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.05)), url(${book.coverUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : undefined
            }
          >
            <p className={`text-[15px] font-semibold ${book.coverUrl ? 'text-white' : 'text-gray-900'}`}>
              {book.title}
            </p>
            <p className={`text-xs ${book.coverUrl ? 'text-white/80' : 'text-gray-500'}`}>
              {book.author}
            </p>
            {typeof book.rating === 'number' && (
              <div className="mt-1 text-xs tracking-wide">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={i < book.rating ? 'text-orange-400' : book.coverUrl ? 'text-white/30' : 'text-gray-200'}
                  >
                    ★
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}