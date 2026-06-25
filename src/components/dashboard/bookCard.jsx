'use client'

/**
 * BookCard
 * --------
 * props:
 * - book: { id, title, author, coverUrl, rating?, progress? }
 * - variant: "wide" (scroll horizontal, sedang dibaca) | "grid" (rekomendasi/grid)
 * - onClick: (book) => void
 */
export default function BookCard({ book, variant = 'grid', onClick }) {
  const { title, author, coverUrl, rating, currentPage, totalPages } = book
  const percent = totalPages > 0 ? Math.min(100, Math.round((currentPage / totalPages) * 100)) : null

  if (variant === 'wide') {
    return (
      <button
        type="button"
        onClick={() => onClick?.(book)}
        className="flex gap-3 min-w-[220px] max-w-[260px] bg-white border border-gray-200 rounded-2xl p-3.5 text-left hover:shadow-md transition-shadow shrink-0"
      >
        {/* Cover */}
        <div className="w-[52px] h-[76px] rounded-lg bg-orange-50 overflow-hidden shrink-0 flex items-center justify-center">
          {coverUrl ? (
            <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg font-serif text-orange-700">{title?.charAt(0)}</span>
          )}
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <p className="text-[13.5px] font-semibold text-gray-900 line-clamp-2 leading-snug">{title}</p>
            <p className="text-[11.5px] text-gray-500 mt-0.5 truncate">{author}</p>
          </div>
          {percent !== null && (
            <div className="mt-2">
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${percent}%` }} />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">{percent}%</p>
            </div>
          )}
        </div>
      </button>
    )
  }

  // variant === 'grid'
  return (
    <button
      type="button"
      onClick={() => onClick?.(book)}
      className="flex flex-col text-left group"
    >
      <div className="w-full aspect-[2/3] rounded-xl bg-orange-50 overflow-hidden mb-2 flex items-center justify-center">
        {coverUrl ? (
          <img src={coverUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <span className="text-2xl font-serif text-orange-700">{title?.charAt(0)}</span>
        )}
      </div>
      <p className="text-[13px] font-semibold text-gray-900 line-clamp-2 leading-snug">{title}</p>
      <p className="text-[11.5px] text-gray-500 mt-0.5 truncate">{author}</p>
      {typeof rating === 'number' && (
        <div className="mt-1 text-xs tracking-wide">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < rating ? 'text-orange-400' : 'text-gray-200'}>★</span>
          ))}
        </div>
      )}
    </button>
  )
}