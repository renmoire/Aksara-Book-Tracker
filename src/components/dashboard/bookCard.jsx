'use client'

import StatusDropdown from './statusDropdown'

/**
 * BookCard
 * --------
 * props:
 * - book: { id, title, author, coverUrl, rating?, progress? }
 * - variant: "wide" (scroll horizontal, sedang dibaca) | "grid" (rekomendasi/grid)
 * - onClick: (book) => void
 * - status: status user_books saat ini, mis. "want_to_read". Jika diisi,
 *           menampilkan StatusDropdown di bawah card (ubah status / hapus).
 * - onChangeStatus: (book, newStatus) => void
 * - onRemove: (book) => void
 * - statusBusy: boolean, disable dropdown saat sedang menyimpan
 */
export default function BookCard({ book, variant = 'grid', onClick, status, onChangeStatus, onRemove, statusBusy }) {
  const { title, author, coverUrl, rating, currentPage, totalPages } = book
  const percent = totalPages > 0 ? Math.min(100, Math.round((currentPage / totalPages) * 100)) : null

  if (variant === 'wide') {
    return (
      <div className="flex gap-3 min-w-[220px] max-w-[260px] bg-white border border-gray-200 rounded-2xl p-3.5 hover:shadow-md transition-shadow shrink-0">
        <button
          type="button"
          onClick={() => onClick?.(book)}
          className="flex gap-3 flex-1 min-w-0 text-left"
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
        {status && (
          <div className="shrink-0 self-start">
            <StatusDropdown
              status={status}
              busy={statusBusy}
              onChangeStatus={(s) => onChangeStatus?.(book, s)}
              onRemove={() => onRemove?.(book)}
            />
          </div>
        )}
      </div>
    )
  }

  // variant === 'grid'
  return (
    <div className="flex flex-col text-left group">
      <button
        type="button"
        onClick={() => onClick?.(book)}
        className="flex flex-col text-left w-full"
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
      {status && (
        <div className="mt-1.5">
          <StatusDropdown
            status={status}
            busy={statusBusy}
            onChangeStatus={(s) => onChangeStatus?.(book, s)}
            onRemove={() => onRemove?.(book)}
          />
        </div>
      )}
    </div>
  )
}