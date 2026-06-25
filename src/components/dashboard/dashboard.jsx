'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/src/lib/supabase'
import { updateBookStatus, removeFromLibrary } from '@/src/lib/userBooks'
import AppShell from '../layout/appShell'
import BookGrid from './bookGrid'
import ShelfRow from './shelfRow'
import CurrentReadsPanel from './currentReadsPanel'
import FeaturedCarousel from './featuredCarousel'

export default function Dashboard() {
  const router = useRouter()

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [currentReads, setCurrentReads] = useState([])
  const [toReadPile, setToReadPile] = useState([])
  const [recommended, setRecommended] = useState([])
  const [shelves, setShelves] = useState([])
  const [ratedBooks, setRatedBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyBookId, setBusyBookId] = useState(null)
  const [homeQuery, setHomeQuery] = useState('')

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
      router.push('/login')
      return
    }
    setUser(userData.user)

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single()
    setProfile(profileData)

    const { data: userBooks } = await supabase
      .from('user_books')
      .select('*, books(*)')
      .eq('user_id', userData.user.id)

    const allUserBooks = userBooks || []

    const reading = allUserBooks
      .filter((b) => b.status === 'current_reading')
      .map((b) => ({
        id: b.id,
        bookId: b.book_id,
        title: b.books?.title,
        author: b.books?.author,
        coverUrl: b.books?.cover_url,
        currentPage: b.current_page || 0,
        totalPages: b.books?.total_pages || 0,
        status: b.status,
      }))
    setCurrentReads(reading)

    const wantToRead = allUserBooks
      .filter((b) => b.status === 'want_to_read')
      .map((b) => ({
        id: b.id,
        bookId: b.book_id,
        title: b.books?.title,
        author: b.books?.author,
        coverUrl: b.books?.cover_url,
        status: b.status,
      }))
    setToReadPile(wantToRead)

    const genreGroups = {}
    allUserBooks.forEach((b) => {
      const genre = b.books?.genre || 'Belum Dikategorikan'
      if (!genreGroups[genre]) genreGroups[genre] = { count: 0, covers: [] }
      genreGroups[genre].count += 1
      if (b.books?.cover_url && genreGroups[genre].covers.length < 3) {
        genreGroups[genre].covers.push(b.books.cover_url)
      }
    })
    const shelvesData = Object.entries(genreGroups).map(([genre, info]) => ({
      id: genre,
      name: genre,
      bookCount: info.count,
      coverUrls: info.covers,
    }))
    setShelves(shelvesData)

    await loadRatedBooks(userData.user.id)
    await loadRecommendations(allUserBooks)
    setLoading(false)
  }

  async function loadRatedBooks(userId) {
    const { data: reviewRows } = await supabase
      .from('reviews')
      .select('*, books(id, title, author, cover_url)')
      .eq('user_id', userId)
      .order('rating', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(8)

    const mapped = (reviewRows || [])
      .filter((r) => r.books)
      .map((r) => ({
        id: r.id,
        bookId: r.book_id,
        title: r.books.title,
        author: r.books.author,
        coverUrl: r.books.cover_url,
        rating: r.rating,
        reviewText: r.review_text || null,
      }))

    setRatedBooks(mapped)
  }

  async function loadRecommendations(allUserBooks) {
    if (allUserBooks.length === 0) { setRecommended([]); return }

    const ownedTitles = new Set(allUserBooks.map((b) => b.books?.title))
    const genres = [...new Set(allUserBooks.map((b) => b.books?.genre).filter(Boolean))]
    const authors = [...new Set(allUserBooks.map((b) => b.books?.author).filter(Boolean))]

    if (genres.length === 0 && authors.length === 0) { setRecommended([]); return }

    let query = supabase.from('books').select('*').limit(20)
    if (genres.length > 0) query = query.in('genre', genres)
    else query = query.in('author', authors)

    const { data: candidateBooks } = await query
    const filtered = (candidateBooks || [])
      .filter((b) => !ownedTitles.has(b.title))
      .slice(0, 5)
      .map((b) => ({ id: b.id, title: b.title, author: b.author, coverUrl: b.cover_url }))

    setRecommended(filtered)
  }

  function handleOpenBook(book) {
    if (book.bookId) router.push(`/book/${book.bookId}`)
  }

  async function handleChangeStatus(book, newStatus) {
    setBusyBookId(book.id)
    const { error } = await updateBookStatus(book.id, newStatus)
    setBusyBookId(null)
    if (!error) {
      await loadDashboard()
    }
  }

  async function handleRemove(book) {
    setBusyBookId(book.id)
    const { error } = await removeFromLibrary(book.id)
    setBusyBookId(null)
    if (!error) {
      await loadDashboard()
    }
  }

  function handleHomeSearch(e) {
    e.preventDefault()
    if (!homeQuery.trim()) return
    router.push(`/explore?q=${encodeURIComponent(homeQuery)}`)
  }

  const firstName = user?.email ? user.email.split('@')[0] : 'Pembaca'

  return (
    <AppShell>
      <div className="flex flex-col gap-8 p-7 min-w-0">
        {/* Header */}
        <header className="flex justify-between items-end">
          <div>
            <p className="text-[13px] text-gray-500 mb-0.5">Selamat datang kembali,</p>
            <h1 className="text-[26px] font-serif text-gray-900 capitalize">
              {loading ? '…' : firstName}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <form onSubmit={handleHomeSearch} className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2 w-[260px] text-gray-400 focus-within:border-orange-400 transition-colors">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM21 21l-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={homeQuery}
                onChange={(e) => setHomeQuery(e.target.value)}
                placeholder="Cari buku, penulis..."
                className="border-none outline-none bg-transparent text-[13px] text-gray-900 w-full placeholder:text-gray-400"
              />
            </form>
            <div className="w-9 h-9 rounded-full bg-[#1a2332] text-[#f3f0ea] flex items-center justify-center text-sm font-semibold shrink-0 overflow-hidden border border-gray-200">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={firstName} className="w-full h-full object-cover" />
              ) : (
                <span className="capitalize">{firstName.charAt(0)}</span>
              )}
            </div>
          </div>
        </header>

        {loading ? (
          <p className="text-gray-400 text-sm">Memuat data...</p>
        ) : (
          <>
            <FeaturedCarousel title="Buku Favoritmu" books={ratedBooks} onBookClick={handleOpenBook} />

            <div className="flex gap-6 items-start">
              <div className="flex-1 min-w-0">
                <BookGrid
                  title="To Read Pile"
                  books={toReadPile}
                  layout="grid"
                  limit={6}
                  onSeeAll={() => router.push('/library')}
                  onBookClick={handleOpenBook}
                  showStatus
                  onChangeStatus={handleChangeStatus}
                  onRemove={handleRemove}
                  busyBookId={busyBookId}
                />
              </div>
              <CurrentReadsPanel
                books={currentReads}
                onSeeAll={() => router.push('/library')}
                onBookClick={handleOpenBook}
                onChangeStatus={handleChangeStatus}
                onRemove={handleRemove}
                busyBookId={busyBookId}
              />
            </div>

            <BookGrid
              title="Rekomendasi Untukmu"
              books={recommended}
              layout="grid"
              onSeeAll={() => {}}
            />

            <ShelfRow shelves={shelves} />
          </>
        )}
      </div>
    </AppShell>
  )
}