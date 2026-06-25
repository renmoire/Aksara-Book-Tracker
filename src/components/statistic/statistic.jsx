'use client'

import AppShell from '../layout/appShell'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

export default function StatisticPage() {
  const currentYear = new Date().getFullYear()

  return (
    <AppShell>
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[13px] text-gray-400 mb-1">Perjalanan membacamu</p>
          <h1 className="text-3xl font-serif text-gray-900">Statistik</h1>
        </div>

        {/* Year tabs */}
        <div className="flex gap-1 mb-8">
          {[currentYear, currentYear - 1].map((y) => (
            <button
              key={y}
              type="button"
              className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                y === currentYear
                  ? 'bg-[#1a2332] text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {y}
            </button>
          ))}
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Buku Selesai', value: '0' },
            { label: 'Halaman Dibaca', value: '0' },
            { label: 'Rata-rata / Bulan', value: '0' },
            { label: 'Genre Terbanyak', value: '—' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl px-5 py-4 border border-gray-100">
              <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-2">{s.label}</p>
              <p className="text-2xl font-serif text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Bar chart — empty state */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="text-[15px] font-semibold text-gray-700 mb-6">Buku per Bulan</h2>
          <div className="flex items-end gap-2 h-32">
            {MONTHS.map((m) => (
              <div key={m} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full bg-gray-100 rounded-sm" style={{ height: '4px' }} />
                <span className="text-[10px] text-gray-400">{m}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-[12px] text-gray-400 mt-6">
            Belum ada data buku selesai untuk tahun ini.
          </p>
        </section>

        {/* Genre breakdown — empty */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-[15px] font-semibold text-gray-700 mb-4">Sebaran Genre</h2>
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-gray-300" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 3.5h10v17l-5-3.5-5 3.5Z" />
            </svg>
            <p className="text-[13px] text-gray-400">Tambahkan buku ke rak untuk melihat sebaran genre.</p>
          </div>
        </section>
      </div>
    </AppShell>
  )
}