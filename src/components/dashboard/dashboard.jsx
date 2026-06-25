'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/src/lib/supabase'
import AppShell from '../layout/appShell'
import BookGrid from './bookGrid'
import ShelfRow from './shelfRow'
import CurrentReadsPanel from './currentReadsPanel'
import FeaturedCarousel from './featuredCarousel'

const DUMMY_POPULAR = [
  { id: 'f1', title: 'Laut Bercerita', author: 'Leila S. Chudori', coverUrl: null, rating: 5 },
  { id: 'f2', title: 'Pulang', author: 'Leila S. Chudori', coverUrl: null, rating: 4 },
  { id: 'f3', title: 'Bumi Manusia', author: 'Pramoedya A.T.', coverUrl: null, rating: 5 },
]

export default function Dashboard() {
  const router = useRouter()

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [currentReads, setCurrentReads] = useState([])
  const [toReadPile, setToReadPile] = useState([])
  const [recommended, setRecommended] = useState([])
  const [shelves, setShelves] = useState([])
  const [loading, setLoading] = useState(true)

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
        title: b.books?.title,
        author: b.books?.author,
        coverUrl: b.books?.cover_url,
        currentPage: b.current_page || 0,
        totalPages: b.books?.total_pages || 0,
      }))
    setCurrentReads(reading)

    const wantToRead = allUserBooks
      .filter((b) => b.status === 'want_to_read')
      .map((b) => ({
        id: b.id,
        title: b.books?.title,
        author: b.books?.author,
        coverUrl: b.books?.cover_url,
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

    await loadRecommendations(allUserBooks)
    setLoading(false)
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
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2 w-[260px] text-gray-400">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM21 21l-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Cari buku, penulis..."
              className="border-none outline-none bg-transparent text-[13px] text-gray-900 w-full placeholder:text-gray-400"
            />
          </div>
        </header>

        {loading ? (
          <p className="text-gray-400 text-sm">Memuat data...</p>
        ) : (
          <>
            <FeaturedCarousel title="Popular" books={DUMMY_POPULAR} />

            <div className="flex gap-6 items-start">
              <div className="flex-1 min-w-0">
                <BookGrid
                  title="To Read Pile"
                  books={toReadPile}
                  layout="grid"
                  onSeeAll={() => router.push('/library')}
                />
              </div>
              <CurrentReadsPanel books={currentReads} onSeeAll={() => router.push('/library')} />
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