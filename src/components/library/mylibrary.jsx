'use client'

import { useState } from 'react'
import AppShell from '../layout/appShell'

const TABS = [
  { key: 'all', label: 'Semua' },
  { key: 'reading', label: 'Sedang Dibaca' },
  { key: 'want', label: 'To-Read' },
  { key: 'done', label: 'Selesai' },
]

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState('all')

  return (
    <AppShell>
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[13px] text-gray-400 mb-1">Koleksi bukumu</p>
            <h1 className="text-3xl font-serif text-gray-900">My Library</h1>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 bg-[#1a2332] text-white text-[13px] font-medium px-4 py-2.5 rounded-xl hover:bg-[#243044] transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Tambah Buku
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 text-[13px] font-medium border-b-2 transition-colors -mb-px ${
                activeTab === t.key
                  ? 'border-[#1a2332] text-[#1a2332]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Empty state */}
        <EmptyLibrary tab={activeTab} />
      </div>
    </AppShell>
  )
}

function EmptyLibrary({ tab }) {
  const messages = {
    all: { title: 'Perpustakaanmu masih kosong', desc: 'Mulai dengan menambahkan buku pertamamu.' },
    reading: { title: 'Tidak ada buku yang sedang dibaca', desc: 'Tandai buku sebagai "Sedang Dibaca" untuk melacak progresmu.' },
    want: { title: 'To-Read pile kosong', desc: 'Temukan buku baru di Explore dan tambahkan ke daftar.' },
    done: { title: 'Belum ada buku yang selesai', desc: 'Buku yang sudah kamu tandai selesai akan muncul di sini.' },
  }
  const { title, desc } = messages[tab] || messages.all

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 border border-dashed border-gray-200 rounded-2xl bg-white/50 text-center">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="text-gray-300" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4.5C4 3.4 4.9 3 5.5 3h13C19.1 3 20 3.4 20 4.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4.5Z" />
        <path d="M9 3v18M4 8h5M4 12h5M4 16h5" />
      </svg>
      <p className="text-[14px] font-medium text-gray-500">{title}</p>
      <p className="text-[12.5px] text-gray-400 max-w-xs">{desc}</p>
      <button
        type="button"
        className="mt-2 flex items-center gap-1.5 bg-[#1a2332] text-white text-[12.5px] font-medium px-4 py-2 rounded-lg hover:bg-[#243044] transition-colors"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Tambah Buku
      </button>
    </div>
  )
}