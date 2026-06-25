'use client'

/**
 * JournalList
 * -----------
 * Daftar riwayat baca (journal) untuk satu buku, urut dari terbaru.
 * props:
 * - entries: [{ id, date, pages_read, page_at_entry }]
 * - totalPages
 */
export default function JournalList({ entries = [], totalPages = 0 }) {
  if (entries.length === 0) {
    return (
      <p className="text-[13px] text-gray-400 text-center py-6 border border-dashed border-gray-200 rounded-2xl">
        Belum ada catatan baca. Update progress untuk mulai mencatat.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry) => {
        const percent =
          totalPages > 0 ? Math.min(100, Math.round((entry.page_at_entry / totalPages) * 100)) : 0

        return (
          <div key={entry.id} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[13px] font-semibold text-gray-900">{formatDate(entry.date)}</p>
              <span className="text-[12px] text-gray-500">
                +{entry.pages_read} halaman
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mb-1.5">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: `${percent}%` }} />
            </div>
            <p className="text-[11.5px] text-gray-400">
              Sampai halaman {entry.page_at_entry} ({percent}%)
            </p>
          </div>
        )
      })}
    </div>
  )
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}