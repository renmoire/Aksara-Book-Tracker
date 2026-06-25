'use client'

import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/src/lib/supabase'

const NAV_ITEMS = [
  { key: 'home',      label: 'Home',       href: '/dashboard',  disabled: false },
  { key: 'explore',   label: 'Explore',    href: '/explore',    disabled: false },
  { key: 'community', label: 'Community',  href: '/community',  disabled: true  },
  { key: 'statistic', label: 'Statistic',  href: '/statistic',  disabled: false },
  { key: 'library',   label: 'My Library', href: '/library',    disabled: false },
]

function NavIcon({ name }) {
  const cls = "shrink-0"
  switch (name) {
    case 'home':
      return (
        <svg className={cls} viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5Z" />
        </svg>
      )
    case 'explore':
      return (
        <svg className={cls} viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      )
    case 'community':
      return (
        <svg className={cls} viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12.5 9 17l11-11" />
        </svg>
      )
    case 'statistic':
      return (
        <svg className={cls} viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 3.5h10v17l-5-3.5-5 3.5Z" />
        </svg>
      )
    case 'library':
      return (
        <svg className={cls} viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4.5C4 3.4 4.9 3 5.5 3h13C19.1 3 20 3.4 20 4.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4.5Z" />
          <path d="M9 3v18M4 8h5M4 12h5M4 16h5" />
        </svg>
      )
    default:
      return null
  }
}

export default function Sidebar({ user }) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

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
            <img src={user.avatarUrl} alt={user?.name} className="w-full h-full object-cover" />
          ) : (
            <span>{(user?.name ?? 'r').charAt(0)}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-[#f3f0ea] truncate">{user?.name ?? 'rendevmail'}</p>
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
              onClick={() => !item.disabled && router.push(item.href)}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] text-left transition-colors ${
                item.disabled
                  ? 'text-[#6e7890] cursor-default'
                  : isActive
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

      {/* Logout */}
      <div className="mt-auto pt-3 border-t border-white/10">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-[#b9c0d1] hover:bg-white/5 hover:text-[#f3f0ea] transition-colors w-full"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}