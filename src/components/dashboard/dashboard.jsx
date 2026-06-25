'use client'

import AppShell from '../layout/appShell'

export default function Dashboard() {
  return (
    <AppShell>
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[13px] text-gray-400 mb-1">Selamat datang kembali,</p>
          <h1 className="text-3xl font-serif text-gray-900">Beranda</h1>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Sedang Dibaca', value: '0', sub: 'buku aktif' },
            { label: 'Selesai Tahun Ini', value: '0', sub: 'dari target —' },
            { label: 'To-Read Pile', value: '0', sub: 'buku menunggu' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl px-5 py-4 border border-gray-100">
              <p className="text-[11.5px] uppercase tracking-wide text-gray-400 mb-1">{s.label}</p>
              <p className="text-3xl font-serif text-gray-900">{s.value}</p>
              <p className="text-[12px] text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Currently reading */}
        <Section title="Sedang Dibaca" action="Lihat semua" href="/library">
          <EmptyState
            icon={<BookIcon />}
            title="Belum ada buku yang sedang dibaca"
            desc="Tambahkan buku ke rak 'Sedang Dibaca' di My Library."
          />
        </Section>

        {/* To-read pile */}
        <Section title="To-Read Pile" action="Lihat semua" href="/library">
          <EmptyState
            icon={<PileIcon />}
            title="To-read pile kosong"
            desc="Temukan buku baru di Explore dan tambahkan ke daftar bacaanmu."
          />
        </Section>
      </div>
    </AppShell>
  )
}

function Section({ title, action, href, children }) {
  return (
    <section className="mb-8">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-[17px] font-serif text-gray-800">{title}</h2>
        {action && (
          <a href={href} className="text-[12.5px] font-medium text-orange-500 hover:underline">
            {action}
          </a>
        )}
      </div>
      {children}
    </section>
  )
}

function EmptyState({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 border border-dashed border-gray-200 rounded-2xl text-center bg-white/50">
      <span className="text-gray-300 mb-1">{icon}</span>
      <p className="text-[13.5px] font-medium text-gray-500">{title}</p>
      <p className="text-[12px] text-gray-400 max-w-xs">{desc}</p>
    </div>
  )
}

function BookIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6.5c-2-1.5-5-2-8-1.5v12c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5Z" />
      <line x1="12" y1="6.5" x2="12" y2="18.5" />
    </svg>
  )
}

function PileIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="4" rx="1" />
      <rect x="4" y="10" width="16" height="4" rx="1" />
      <rect x="4" y="16" width="16" height="4" rx="1" />
    </svg>
  )
}