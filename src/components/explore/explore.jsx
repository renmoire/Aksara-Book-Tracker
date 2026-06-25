'use client'

import AppShell from '../layout/appShell'

const GENRES = [
  { label: 'Fiksi', color: 'bg-orange-50 text-orange-600 border-orange-100' },
  { label: 'Non-Fiksi', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { label: 'Sastra', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { label: 'Sejarah', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  { label: 'Sains', color: 'bg-violet-50 text-violet-600 border-violet-100' },
  { label: 'Biografi', color: 'bg-rose-50 text-rose-600 border-rose-100' },
  { label: 'Filsafat', color: 'bg-slate-50 text-slate-600 border-slate-200' },
  { label: 'Thriller', color: 'bg-red-50 text-red-600 border-red-100' },
]

export default function ExplorePage() {
  return (
    <AppShell>
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[13px] text-gray-400 mb-1">Temukan bacaan baru</p>
          <h1 className="text-3xl font-serif text-gray-900">Explore</h1>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl px-4 py-3 mb-8 max-w-lg">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-gray-400 shrink-0">
            <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Cari judul, penulis, atau ISBN..."
            className="border-none outline-none bg-transparent text-[13.5px] text-gray-800 w-full placeholder:text-gray-400"
          />
        </div>

        {/* Genre filter */}
        <section className="mb-8">
          <h2 className="text-[15px] font-semibold text-gray-700 mb-3">Jelajahi Genre</h2>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                key={g.label}
                type="button"
                className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium border transition-opacity hover:opacity-80 ${g.color}`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </section>

        {/* Results area — empty state */}
        <section>
          <h2 className="text-[17px] font-serif text-gray-800 mb-4">Buku Populer</h2>
          <div className="flex flex-col items-center justify-center gap-2 py-16 border border-dashed border-gray-200 rounded-2xl bg-white/50 text-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-gray-300 mb-1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <p className="text-[13.5px] font-medium text-gray-500">Katalog buku belum tersedia</p>
            <p className="text-[12px] text-gray-400 max-w-xs">Hubungkan ke sumber data buku untuk mulai menjelajah.</p>
          </div>
        </section>
      </div>
    </AppShell>
  )
}