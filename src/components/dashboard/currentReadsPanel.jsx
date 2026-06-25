'use client'

/**
 * CurrentReadsPanel
 * ------------------
 * Panel kanan dashboard, daftar buku yang sedang dibaca dengan progress detail.
 * props:
 * - books: [{ id, title, author, coverUrl, currentPage, totalPages }]
 */
export default function CurrentReadsPanel({ books = [], onSeeAll }) {
  return (
    <aside className="w-[280px] shrink-0 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm h-fit flex flex-col gap-2">
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="text-base font-serif text-gray-900">Current Reads</h2>
        {onSeeAll && (
          <button type="button" onClick={onSeeAll} className="text-[11.5px] font-semibold text-orange-600 hover:underline">
            Lihat semua
          </button>
        )}
      </div>

      {books.length === 0 ? (
        <p className="text-[13px] text-gray-400">Belum ada buku yang sedang dibaca.</p>
      ) : (
        <div className="flex flex-col gap-3.5">
          {books.map((book) => (
            <CurrentReadCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </aside>
  )
}

function CurrentReadCard({ book }) {
  const { title, author, coverUrl, currentPage = 0, totalPages = 0 } = book
  const percent = totalPages > 0 ? Math.min(100, Math.round((currentPage / totalPages) * 100)) : 0

  return (
    <div className="flex gap-3 pb-3.5 border-b border-gray-100 last:border-b-0 last:pb-0">
      <div className="w-[44px] h-[64px] rounded-md bg-orange-50 overflow-hidden shrink-0 flex items-center justify-center">
        {coverUrl ? (
          <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-sm font-serif text-orange-700">{title?.charAt(0)}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-gray-900 truncate">{title}</p>
        <p className="text-[11.5px] text-gray-500 truncate mb-1.5">{author}</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${percent}%` }} />
          </div>
          <span className="text-[11px] text-gray-500 shrink-0">{percent}%</span>
        </div>
        <p className="text-[11px] text-gray-400 mt-1">
          Hal. {currentPage} dari {totalPages || '?'}
        </p>
      </div>
    </div>
  )
}