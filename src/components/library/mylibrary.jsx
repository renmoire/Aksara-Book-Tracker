'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/src/lib/supabase'
import { updateBookStatus, removeFromLibrary } from '@/src/lib/userBooks'
import AppShell from '../layout/appShell'
import BookGrid from '../dashboard/bookGrid'

const TABS = [
  { key: 'all', label: 'Semua', status: null },
  { key: 'reading', label: 'Sedang Dibaca', status: 'current_reading' },
  { key: 'want', label: 'To-Read', status: 'want_to_read' },
  { key: 'done', label: 'Selesai', status: 'completed' },
]

const EMPTY_MESSAGES = {
  all: { title: 'Perpustakaanmu masih kosong', desc: 'Mulai dengan menambahkan buku pertamamu.' },
  reading: { title: 'Tidak ada buku yang sedang dibaca', desc: 'Tandai buku sebagai "Sedang Dibaca" untuk melacak progresmu.' },
  want: { title: 'To-Read pile kosong', desc: 'Temukan buku baru di Explore dan tambahkan ke daftar.' },
  done: { title: 'Belum ada buku yang selesai', desc: 'Buku yang sudah kamu tandai selesai akan muncul di sini.' },
}

export default function LibraryPage() {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState('all')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyBookId, setBusyBookId] = useState(null)

  useEffect(() => {
    loadLibrary()
  }, [])

  async function loadLibrary() {
    setLoading(true)

    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) {
      router.push('/login')
      return
    }

    const { data: userBooks } = await supabase
      .from('user_books')
      .select('*, books(*)')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })

    const mapped = (userBooks || []).map((b) => ({
      id: b.id,
      bookId: b.book_id,
      title: b.books?.title,
      author: b.books?.author,
      coverUrl: b.books?.cover_url,
      currentPage: b.current_page || 0,
      totalPages: b.books?.total_pages || 0,
      status: b.status,
    }))

    setBooks(mapped)
    setLoading(false)
  }

  function handleOpenBook(book) {
    if (book.bookId) router.push(`/book/${book.bookId}`)
  }

  async function handleChangeStatus(book, newStatus) {
    setBusyBookId(book.id)
    const { error } = await updateBookStatus(book.id, newStatus)
    setBusyBookId(null)
    if (!error) await loadLibrary()
  }

  async function handleRemove(book) {
    setBusyBookId(book.id)
    const { error } = await removeFromLibrary(book.id)
    setBusyBookId(null)
    if (!error) await loadLibrary()
  }

  const activeTabDef = TABS.find((t) => t.key === activeTab) || TABS[0]
  const filteredBooks = activeTabDef.status
    ? books.filter((b) => b.status === activeTabDef.status)
    : books

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
            onClick={() => router.push('/explore')}
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
          {TABS.map((t) => {
            const count = t.status ? books.filter((b) => b.status === t.status).length : books.length
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={`px-4 py-2 text-[13px] font-medium border-b-2 transition-colors -mb-px flex items-center gap-1.5 ${
                  activeTab === t.key
                    ? 'border-[#1a2332] text-[#1a2332]'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {t.label}
                {!loading && count > 0 && (
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                    activeTab === t.key ? 'bg-[#1a2332] text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-gray-400 text-sm">Memuat koleksi...</p>
        ) : filteredBooks.length === 0 ? (
          <EmptyLibrary tab={activeTab} onAddBook={() => router.push('/explore')} />
        ) : (
          <BookGrid
            title=""
            books={filteredBooks}
            layout="grid"
            onBookClick={handleOpenBook}
            showStatus
            onChangeStatus={handleChangeStatus}
            onRemove={handleRemove}
            busyBookId={busyBookId}
          />
        )}
      </div>
    </AppShell>
  )
}

function EmptyLibrary({ tab, onAddBook }) {
  const { title, desc } = EMPTY_MESSAGES[tab] || EMPTY_MESSAGES.all

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
        onClick={onAddBook}
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