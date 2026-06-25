'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/src/lib/supabase'

const NAV_ITEMS = [
  { key: 'overview', label: 'Ringkasan', href: '/dashboard' },
  { key: 'reading', label: 'Sedang Dibaca', href: '/reading' },
  { key: 'finished', label: 'Selesai', href: '/completed' },
  { key: 'wishlist', label: 'Wishlist', href: '/wishlist' },
]

const SHELVES = [
  { key: 'fiction', label: 'Fiksi Favorit', count: 12 },
  { key: 'nonfiction', label: 'Non-Fiksi', count: 7 },
  { key: 'rereads', label: 'Baca Ulang', count: 3 },
]

function NavIcon({ name }) {
  const paths = {
    overview: 'M3 10.5 12 3l9 7.5M5 9.5V20h14V9.5',
    reading: 'M12 6.5c-2-1.5-5-2-8-1.5v12c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5Z',
    finished: 'M4 12.5 9 17l11-11',
    wishlist: 'M7 3.5h10v17l-5-3.5-5 3.5Z',
  }
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  )
}

export default function Sidebar({ user, readingGoal }) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const goalPercent = readingGoal
    ? Math.min(100, Math.round((readingGoal.current / readingGoal.target) * 100))
    : 0

  return (
    <aside className="w-[248px] shrink-0 h-screen bg-[#1a2332] flex flex-col gap-7 py-6 px-4 sticky top-0 overflow-y-auto">
      {/* Brand */}
      <div className="flex items-center gap-2.5 pl-1">
        <span className="w-8 h-8 rounded-lg bg-white text-[#1a2332] font-semibold flex items-center justify-center text-sm">
          A
        </span>
        <span className="text-[#f3f0ea] text-[17px] font-medium tracking-tight">Aksara</span>
      </div>

      {/* User */}
      <div className="flex items-center gap-2.5 px-2 py-2.5 rounded-xl bg-white/5">
        <div className="w-9 h-9 rounded-full bg-white/10 text-[#f3f0ea] flex items-center justify-center text-sm font-semibold shrink-0 overflow-hidden">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user?.name || 'Pengguna'} className="w-full h-full object-cover" />
          ) : (
            <span>{(user?.name || 'A').charAt(0)}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-[#f3f0ea] truncate">{user?.name || 'Pembaca'}</p>
          <p className="text-[11.5px] text-[#9aa3b5] truncate">{user?.booksThisYear ?? 0} buku tahun ini</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => router.push(item.href)}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] text-left transition-colors ${
                isActive
                  ? 'bg-white text-[#1a2332] font-semibold'
                  : 'text-[#b9c0d1] hover:bg-white/5 hover:text-[#f3f0ea]'
              }`}
            >
              <NavIcon name={item.key} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Shelves */}
      <div className="flex flex-col gap-2">
        <p className="text-[10.5px] uppercase tracking-wide text-[#6e7890] pl-2.5">Rak Kamu</p>
        <ul className="flex flex-col gap-0.5">
          {SHELVES.map((shelf) => (
            <li key={shelf.key}>
              <button
                type="button"
                className="w-full flex justify-between items-center px-2.5 py-2 rounded-lg text-[13px] text-[#b9c0d1] hover:bg-white/5 hover:text-[#f3f0ea] transition-colors"
              >
                <span>{shelf.label}</span>
                <span className="text-[11px] text-[#6e7890]">{shelf.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Reading goal */}
      {readingGoal && (
        <div className="mt-auto p-3.5 rounded-xl bg-white/5">
          <p className="text-[11.5px] text-[#9aa3b5] mb-2">Target {readingGoal.year}</p>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-2">
            <div className="h-full bg-[#7dd3c0] rounded-full" style={{ width: `${goalPercent}%` }} />
          </div>
          <p className="text-[12px] text-[#f3f0ea] font-medium">
            {readingGoal.current} / {readingGoal.target} buku
          </p>
        </div>
      )}

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-[#b9c0d1] hover:bg-white/5 hover:text-[#f3f0ea] transition-colors border-t border-white/10 pt-3"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span>Logout</span>
      </button>
    </aside>
  )
}