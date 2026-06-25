'use client'

/**
 * ShelfRow
 * --------
 * Baris koleksi/rak buku di bagian bawah dashboard.
 * props:
 * - shelves: [{ id, name, bookCount, coverUrls: [url, url, url] }]
 */
export default function ShelfRow({ shelves = [], onShelfClick }) {
  return (
    <section>
      <h2 className="text-[19px] font-serif text-gray-900 mb-3.5">Koleksi</h2>

      <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
        {shelves.map((shelf) => (
          <button
            key={shelf.id}
            type="button"
            onClick={() => onShelfClick?.(shelf)}
            className="text-left p-3.5 rounded-2xl border border-gray-200 bg-white hover:-translate-y-0.5 hover:shadow-md transition-all"
          >
            <div className="flex h-14 mb-3">
              {shelf.coverUrls && shelf.coverUrls.length > 0 ? (
                shelf.coverUrls.slice(0, 3).map((url, i) => (
                  <span
                    key={i}
                    className="w-[34px] h-[52px] rounded-md bg-orange-50 bg-cover bg-center border-2 border-white -ml-3.5 first:ml-0"
                    style={{ backgroundImage: url ? `url(${url})` : undefined }}
                  />
                ))
              ) : (
                <span className="w-[34px] h-[52px] rounded-md bg-gray-50 border border-dashed border-gray-200" />
              )}
            </div>
            <p className="text-[13.5px] font-semibold text-gray-900 mb-0.5">{shelf.name}</p>
            <p className="text-xs text-gray-500">{shelf.bookCount} buku</p>
          </button>
        ))}
      </div>
    </section>
  )
}