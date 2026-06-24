'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import Sidebar from '../../components/sidebar'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [currentReading, setCurrentReading] = useState([])
  const [wantToRead, setWantToRead] = useState([])
  const [stats, setStats] = useState({ reading: 0, completed: 0 })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadDashboard = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) { router.push('/login'); return }
      setUser(userData.user)

      const { data: books } = await supabase
        .from('user_books')
        .select('*, books(*)')
        .eq('user_id', userData.user.id)

      if (books) {
        const reading = books.filter((b) => b.status === 'current_reading')
        const want = books.filter((b) => b.status === 'want_to_read')
        const completed = books.filter((b) => b.status === 'completed')
        setCurrentReading(reading)
        setWantToRead(want)
        setStats({ reading: reading.length, completed: completed.length })
      }
      setLoading(false)
    }
    loadDashboard()
  }, [router])

  const firstName = user?.email ? user.email.split('@')[0] : ''

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#eef2f7' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#eef2f7', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <Sidebar />

      {/* Main content */}
      <div style={{ flex: 1, padding: '12px 12px 12px 0' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          minHeight: '100%',
          padding: '32px 36px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <div>
              <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.4px' }}>
                Halo, {firstName} 👋
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
                Yuk lanjut baca buku kamu hari ini
              </p>
            </div>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: '#eff6ff', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 700, fontSize: '15px', color: '#2563eb',
            }}>
              {firstName.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '36px' }}>
            <StatCard label="Sedang dibaca" value={stats.reading} icon="📖" />
            <StatCard label="Selesai" value={stats.completed} icon="✅" />
            <StatCard label="Reading streak" value="0 hari" icon="🔥" />
            <StatCard label="Want to read" value={wantToRead.length} icon="🔖" />
          </div>

          {/* Sedang dibaca */}
          <SectionHeader title="Sedang dibaca" />
          {currentReading.length === 0 ? (
            <EmptyState text="Belum ada buku yang sedang dibaca." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '36px' }}>
              {currentReading.map((item) => <BookProgressCard key={item.id} item={item} />)}
            </div>
          )}

          {/* Want to read */}
          <SectionHeader title="Want to read" />
          {wantToRead.length === 0 ? (
            <EmptyState text="Belum ada buku di daftar want to read." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              {wantToRead.map((item) => <BookSimpleCard key={item.id} item={item} />)}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <div style={{
      background: '#f8fafc', borderRadius: '14px', padding: '18px 20px',
      border: '1px solid #e2e8f0',
    }}>
      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 8px', fontWeight: 500 }}>{label}</p>
      <p style={{ fontSize: '26px', fontWeight: 700, margin: 0, color: '#0f172a', letterSpacing: '-0.5px' }}>{value}</p>
    </div>
  )
}

function SectionHeader({ title }) {
  return (
    <h2 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 600, color: '#0f172a', letterSpacing: '-0.2px' }}>
      {title}
    </h2>
  )
}

function EmptyState({ text }) {
  return <p style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '32px' }}>{text}</p>
}

function BookProgressCard({ item }) {
  const book = item.books
  const totalPages = book?.total_pages || 0
  const currentPage = item.current_page || 0
  const percent = totalPages > 0 ? Math.min(100, Math.round((currentPage / totalPages) * 100)) : 0

  return (
    <div style={{
      background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px',
      padding: '16px', display: 'flex', gap: '14px',
    }}>
      <BookCover url={book?.cover_url} size="large" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 600, fontSize: '14px', margin: '0 0 2px', color: '#0f172a' }}>{book?.title}</p>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 12px' }}>{book?.author}</p>
        <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden', marginBottom: '6px' }}>
          <div style={{ width: `${percent}%`, height: '100%', background: '#2563eb', borderRadius: '99px' }} />
        </div>
        <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0 }}>
          Halaman {currentPage} dari {totalPages || '?'} · {percent}%
        </p>
      </div>
    </div>
  )
}

function BookSimpleCard({ item }) {
  const book = item.books
  return (
    <div style={{
      background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px',
      padding: '14px 16px', display: 'flex', gap: '14px', alignItems: 'center',
    }}>
      <BookCover url={book?.cover_url} size="small" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 600, fontSize: '14px', margin: '0 0 2px', color: '#0f172a' }}>{book?.title}</p>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>{book?.author}</p>
      </div>
    </div>
  )
}

function BookCover({ url, size }) {
  const dims = size === 'large' ? { width: '58px', height: '86px' } : { width: '48px', height: '70px' }
  if (url) {
    return <img src={url} alt="" style={{ ...dims, objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
  }
  return (
    <div style={{
      ...dims, background: '#f1f5f9', borderRadius: '8px', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
    }}>📖</div>
  )
}