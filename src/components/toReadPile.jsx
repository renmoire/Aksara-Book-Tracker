'use client'

function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20s-7-4.5-9.5-9C.5 7.5 2 4 5.5 4 8 4 9.5 5.5 12 8c2.5-2.5 4-4 6.5-4C22 4 23.5 7.5 21.5 11 19 15.5 12 20 12 20Z" />
    </svg>
  )
}

/**
 * ToReadPile
 * ----------
 * Panel kanan, daftar antrian buku yang mau dibaca (ranking).
 * props:
 * - books: [{ id, title, percent (opsional), favorite (boolean) }]
 */
export default function ToReadPile({ books = [], onToggleFavorite }) {
  return (
    <aside className="w-[280px] shrink-0 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm h-fit">
      <h2 className="text-base font-serif text-gray-900 mb-4">To-Read Pile</h2>

      {books.length === 0 ? (
        <p className="text-[13px] text-gray-400">Belum ada buku di antrian.</p>
      ) : (
        <ol className="flex flex-col gap-3.5">
          {books.map((book, index) => (
            <li key={book.id} className="flex items-center gap-2.5">
              <span className="text-xs text-gray-400 w-[18px] shrink-0">{index + 1}</span>
              <span className="flex-1 text-[13px] text-gray-900 truncate">{book.title}</span>
              {typeof book.percent === 'number' && (
                <span className="text-xs text-gray-500 shrink-0">{book.percent}%</span>
              )}
              <button
                type="button"
                onClick={() => onToggleFavorite?.(book.id)}
                aria-label="Tandai favorit"
                className={`shrink-0 flex items-center p-0.5 ${
                  book.favorite ? 'text-orange-500' : 'text-gray-300 hover:text-gray-400'
                }`}
              >
                <HeartIcon filled={book.favorite} />
              </button>
            </li>
          ))}
        </ol>
      )}
    </aside>
  )
}