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
      if (!userData.user) {
        router.push('/login')
        return
      }
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

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '40px' }}>
          <p style={{ color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    )
  }

  const firstName = user?.email ? user.email.split('@')[0] : ''

  return (
    <div style={{ display: 'flex', background: '#f9fafb', minHeight: '100vh' }}>
      <Sidebar />

      <div style={{ flex: 1, padding: '32px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '24px', color: '#111827' }}>
              Halo, {firstName} 👋
            </h1>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
              Yuk lanjut baca buku kamu hari ini
            </p>
          </div>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '14px',
              color: '#2563eb',
            }}
          >
            {firstName.charAt(0).toUpperCase()}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
          <StatCard label="Sedang dibaca" value={stats.reading} />
          <StatCard label="Selesai" value={stats.completed} />
          <StatCard label="Reading streak" value="0 hari" />
          <StatCard label="Want to read" value={wantToRead.length} />
        </div>

        <SectionHeader title="Sedang dibaca" />
        {currentReading.length === 0 ? (
          <EmptyState text="Belum ada buku yang sedang dibaca." />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {currentReading.map((item) => (
              <BookProgressCard key={item.id} item={item} />
            ))}
          </div>
        )}

        <SectionHeader title="Want to read" />
        {wantToRead.length === 0 ? (
          <EmptyState text="Belum ada buku di daftar want to read." />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {wantToRead.map((item) => (
              <BookSimpleCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div style={{ background: '#f3f4f6', borderRadius: '8px', padding: '16px' }}>
      <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px' }}>{label}</p>
      <p style={{ fontSize: '24px', fontWeight: 600, margin: 0, color: '#111827' }}>{value}</p>
    </div>
  )
}

function SectionHeader({ title }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 16px' }}>
      <h2 style={{ margin: 0, fontSize: '18px', color: '#111827' }}>{title}</h2>
    </div>
  )
}

function EmptyState({ text }) {
  return (
    <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '32px' }}>{text}</p>
  )
}

function BookProgressCard({ item }) {
  const book = item.books
  const totalPages = book?.total_pages || 0
  const currentPage = item.current_page || 0
  const percent = totalPages > 0 ? Math.min(100, Math.round((currentPage / totalPages) * 100)) : 0

  return (
    <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', display: 'flex', gap: '14px' }}>
      <BookCover url={book?.cover_url} size="large" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 600, fontSize: '15px', margin: '0 0 2px', color: '#111827' }}>{book?.title}</p>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 10px' }}>{book?.author}</p>
        <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden', marginBottom: '6px' }}>
          <div style={{ width: `${percent}%`, height: '100%', background: '#2563eb' }} />
        </div>
        <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
          Halaman {currentPage} dari {totalPages || '?'}
        </p>
      </div>
    </div>
  )
}

function BookSimpleCard({ item }) {
  const book = item.books
  return (
    <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', display: 'flex', gap: '14px', alignItems: 'center' }}>
      <BookCover url={book?.cover_url} size="small" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 600, fontSize: '14px', margin: '0 0 2px', color: '#111827' }}>{book?.title}</p>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{book?.author}</p>
      </div>
    </div>
  )
}

function BookCover({ url, size }) {
  const dims = size === 'large' ? { width: '60px', height: '88px' } : { width: '50px', height: '74px' }
  if (url) {
    return (
      <img
        src={url}
        alt=""
        style={{ ...dims, objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
      />
    )
  }
  return (
    <div
      style={{
        ...dims,
        background: '#f3f4f6',
        borderRadius: '6px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#d1d5db',
        fontSize: '20px',
      }}
    >
      📖
    </div>
  )
}