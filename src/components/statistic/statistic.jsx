'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { getStatistics } from '@/src/lib/statistics'
import AppShell from '../layout/appShell'

const MONTHS = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']

// ─── helpers ────────────────────────────────────────────────────────────────

function deriveStats(finishedBooks, allUserBooks, readingHistory, year) {
  // Buku selesai tahun ini
  const booksFinished = finishedBooks.length

  // Total halaman dari reading_history tahun ini
  const totalPages = readingHistory.reduce((s, r) => s + (r.pages_read || 0), 0)

  // Rata-rata buku selesai per bulan (dari yang sudah lewat)
  const currentMonth = new Date().getFullYear() === year ? new Date().getMonth() + 1 : 12
  const avgPerMonth  = currentMonth > 0 ? (booksFinished / currentMonth).toFixed(1) : '0'

  // Genre terbanyak dari buku selesai
  const genreCount = {}
  finishedBooks.forEach((ub) => {
    const g = ub.books?.genre
    if (g) genreCount[g] = (genreCount[g] || 0) + 1
  })
  const topGenre = Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'

  // Halaman per bulan (untuk bar chart)
  const pagesPerMonth = Array(12).fill(0)
  readingHistory.forEach((r) => {
    const m = new Date(r.date).getMonth()
    pagesPerMonth[m] += r.pages_read || 0
  })

  // Buku selesai per bulan (untuk bar chart kedua)
  const booksPerMonth = Array(12).fill(0)
  finishedBooks.forEach((ub) => {
    if (ub.finished_at) {
      const m = new Date(ub.finished_at).getMonth()
      booksPerMonth[m] += 1
    }
  })

  // Sebaran genre
  const genreList = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count, pct: Math.round((count / booksFinished) * 100) }))

  // Status breakdown
  const statusCount = { want_to_read: 0, current_reading: 0, finished: 0 }
  allUserBooks.forEach((ub) => { if (statusCount[ub.status] !== undefined) statusCount[ub.status]++ })

  // Longest reading streak (hari berturut-turut dengan aktivitas)
  const activeDays = [...new Set(readingHistory.map((r) => r.date))].sort()
  let maxStreak = 0, cur = 0, prev = null
  activeDays.forEach((d) => {
    if (prev) {
      const diff = (new Date(d) - new Date(prev)) / 86400000
      cur = diff === 1 ? cur + 1 : 1
    } else { cur = 1 }
    maxStreak = Math.max(maxStreak, cur)
    prev = d
  })

  return { booksFinished, totalPages, avgPerMonth, topGenre, pagesPerMonth, booksPerMonth, genreList, statusCount, maxStreak }
}

// ─── sub-components ─────────────────────────────────────────────────────────

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl px-5 py-4 border border-gray-100">
      <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-2">{label}</p>
      <p className="text-2xl font-serif text-gray-900">{value}</p>
    </div>
  )
}

function BarChart({ label, data, color = 'bg-[#1a2332]', unit = '' }) {
  const max = Math.max(...data, 1)
  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
      <h2 className="text-[15px] font-semibold text-gray-700 mb-6">{label}</h2>
      <div className="flex items-end gap-1.5 h-32">
        {data.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
            <div className="relative w-full flex items-end justify-center" style={{ height: '104px' }}>
              {val > 0 && (
                <div
                  className="absolute bottom-0 w-full flex items-center justify-center"
                  style={{ height: `${Math.max(4, (val / max) * 100)}%` }}
                >
                  <div className={`w-full rounded-sm ${color}`} style={{ height: '100%' }} />
                  {/* tooltip */}
                  <span className="absolute -top-6 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 whitespace-nowrap">
                    {val}{unit}
                  </span>
                </div>
              )}
              {val === 0 && <div className="w-full rounded-sm bg-gray-100 absolute bottom-0" style={{ height: '4px' }} />}
            </div>
            <span className="text-[10px] text-gray-400">{MONTHS[i]}</span>
          </div>
        ))}
      </div>
      {data.every((v) => v === 0) && (
        <p className="text-center text-[12px] text-gray-400 mt-4">Belum ada data untuk tahun ini.</p>
      )}
    </section>
  )
}

function GenreBreakdown({ genres, total }) {
  if (genres.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-gray-300" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 3.5h10v17l-5-3.5-5 3.5Z" />
        </svg>
        <p className="text-[13px] text-gray-400">Tambahkan buku ke rak untuk melihat sebaran genre.</p>
      </div>
    )
  }

  const PALETTE = ['bg-[#1a2332]','bg-orange-400','bg-stone-400','bg-amber-300','bg-slate-300']

  return (
    <div className="flex flex-col gap-3">
      {genres.map((g, i) => (
        <div key={g.name}>
          <div className="flex justify-between mb-1">
            <span className="text-[13px] text-gray-700">{g.name}</span>
            <span className="text-[12px] text-gray-400">{g.count} buku · {g.pct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${PALETTE[i % PALETTE.length]} transition-all`}
              style={{ width: `${g.pct}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function RecentFinished({ books }) {
  if (books.length === 0) return null
  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
      <h2 className="text-[15px] font-semibold text-gray-700 mb-4">Buku Selesai Tahun Ini</h2>
      <div className="flex flex-col divide-y divide-gray-50">
        {books.map((ub) => (
          <div key={ub.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <div className="w-9 h-12 rounded-md bg-orange-50 shrink-0 overflow-hidden flex items-center justify-center">
              {ub.books?.cover_url
                ? <img src={ub.books.cover_url} alt={ub.books.title} className="w-full h-full object-cover" />
                : <span className="text-sm font-serif text-orange-700">{ub.books?.title?.charAt(0)}</span>
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-medium text-gray-900 truncate">{ub.books?.title}</p>
              <p className="text-[11.5px] text-gray-400 truncate">{ub.books?.author}</p>
            </div>
            {ub.finished_at && (
              <span className="text-[11px] text-gray-400 shrink-0">
                {new Date(ub.finished_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function StatusBreakdown({ statusCount }) {
  const total = Object.values(statusCount).reduce((s, v) => s + v, 0)
  if (total === 0) return null

  const items = [
    { label: 'Selesai',       key: 'finished',        color: 'bg-[#1a2332]' },
    { label: 'Sedang dibaca', key: 'current_reading',  color: 'bg-orange-400' },
    { label: 'Mau dibaca',    key: 'want_to_read',     color: 'bg-gray-200' },
  ]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
      <h2 className="text-[15px] font-semibold text-gray-700 mb-4">Rak Buku</h2>
      <div className="flex h-2.5 rounded-full overflow-hidden mb-4 gap-0.5">
        {items.map(({ key, color }) => {
          const pct = total > 0 ? (statusCount[key] / total) * 100 : 0
          return pct > 0 ? (
            <div key={key} className={`${color} h-full`} style={{ width: `${pct}%` }} />
          ) : null
        })}
      </div>
      <div className="flex gap-5">
        {items.map(({ label, key, color }) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
            <span className="text-[12px] text-gray-500">{label}</span>
            <span className="text-[12px] font-medium text-gray-800">{statusCount[key]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── main page ───────────────────────────────────────────────────────────────

export default function StatisticPage() {
  const currentYear = new Date().getFullYear()
  const [year, setYear]       = useState(currentYear)
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { finishedBooks, allUserBooks, readingHistory } = await getStatistics(user.id, year)
      setStats(deriveStats(finishedBooks, allUserBooks, readingHistory, year))
      setLoading(false)
    }
    load()
  }, [year])

  return (
    <AppShell>
      <div className="p-8 max-w-4xl mx-auto">
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
              onClick={() => setYear(y)}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                y === year ? 'bg-[#1a2332] text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {y}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-[13px] text-gray-400">Memuat...</p>
        ) : !stats ? (
          <p className="text-[13px] text-gray-400">Gagal memuat data.</p>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard label="Buku Selesai"      value={stats.booksFinished} />
              <StatCard label="Halaman Dibaca"    value={stats.totalPages.toLocaleString('id-ID')} />
              <StatCard label="Rata-rata / Bulan" value={stats.avgPerMonth} />
              <StatCard label="Streak Terpanjang" value={`${stats.maxStreak}h`} />
            </div>

            {/* Status rak */}
            <StatusBreakdown statusCount={stats.statusCount} />

            {/* Bar: buku per bulan */}
            <BarChart
              label="Buku Selesai per Bulan"
              data={stats.booksPerMonth}
              color="bg-[#1a2332]"
            />

            {/* Bar: halaman per bulan */}
            <BarChart
              label="Halaman Dibaca per Bulan"
              data={stats.pagesPerMonth}
              color="bg-orange-400"
              unit=" hal"
            />

            {/* Genre breakdown */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <h2 className="text-[15px] font-semibold text-gray-700 mb-4">Sebaran Genre</h2>
              <GenreBreakdown genres={stats.genreList} total={stats.booksFinished} />
            </section>

            {/* Daftar buku selesai */}
            <RecentFinished books={stats.finishedBooks ?? []} />
          </>
        )}
      </div>
    </AppShell>
  )
}