'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '../lib/supabase'

const menuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    label: 'My Library',
    href: '/library',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    label: 'Search',
    href: '/search',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div
      className={`min-h-screen p-2 flex flex-col shrink-0 transition-all duration-200 ${
        collapsed ? 'w-[76px]' : 'w-[224px]'
      }`}
      style={{ background: '#eef2f7' }}
    >
      <div
        className="flex-1 flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: '#ffffff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          fontFamily: "'Inter', -apple-system, sans-serif",
        }}
      >
        {/* Logo + collapse */}
        <div className="flex items-center gap-2 px-3 py-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: '#94a3b8' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
          {!collapsed && (
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', letterSpacing: '-0.3px' }}>
              Aksara
            </span>
          )}
        </div>

        {/* Menu */}
        <div className="flex-1 px-2">
          {!collapsed && (
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', color: '#94a3b8', padding: '0 10px', marginBottom: '6px', textTransform: 'uppercase' }}>
              Menu
            </p>
          )}
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <div
                key={item.href}
                onClick={() => router.push(item.href)}
                title={collapsed ? item.label : undefined}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl mb-0.5 cursor-pointer transition-all"
                style={{
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#2563eb' : '#64748b',
                  background: isActive ? '#eff6ff' : 'transparent',
                  justifyContent: collapsed ? 'center' : undefined,
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = isActive ? '#2563eb' : '#0f172a' }}
                onMouseLeave={e => { e.currentTarget.style.background = isActive ? '#eff6ff' : 'transparent'; e.currentTarget.style.color = isActive ? '#2563eb' : '#64748b' }}
              >
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </div>
            )
          })}
        </div>

        {/* Logout */}
        <div className="px-2 pb-3 pt-2" style={{ borderTop: '1px solid #f1f5f9' }}>
          <div
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-all"
            style={{
              fontSize: '14px',
              color: '#94a3b8',
              justifyContent: collapsed ? 'center' : undefined,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {!collapsed && <span>Logout</span>}
          </div>
        </div>
      </div>
    </div>
  )
}