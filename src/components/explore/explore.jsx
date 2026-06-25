'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/src/lib/supabase'
import AppShell from '../layout/appShell'

const GENRES = [
  { label: 'Fiksi', color: 'bg-orange-50 text-orange-600 border-orange-100' },
  { label: 'Non-Fiksi', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { label: 'Sastra', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { label: 'Sejarah', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  { label: 'Sains', color: 'bg-violet-50 text-violet-600 border-violet-100' },
  { label: 'Biografi', color: 'bg-rose-50 text-rose-600 border-rose-100' },
  { label: 'Filsafat', color: 'bg-slate-50 text-slate-600 border-slate-200' },
  { label: 'Thriller', color: 'bg-red-50 text-red-600 border-red-100' },
]

export default function ExplorePage() {
  return (
    <Suspense fallback={null}>
      <ExplorePageInner />
    </Suspense>
  )
}

function ExplorePageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [savingId, setSavingId] = useState(null)
  const [message, setMessage] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    if (initialQuery) {
      runSearch(initialQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function runSearch(q) {
    if (!q.trim()) return

    setLoading(true)
    setMessage('')
    setResults([])
    setHasSearched(true)

    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=12&printType=books${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY ? '&key=' + process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY : ''}`
      )
      const data = await res.json()
      setResults(data.items || [])
    } catch (err) {
      setMessage('Gagal mengambil data. Coba lagi.')
    }

    setLoading(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    router.replace(`/explore?q=${encodeURIComponent(query)}`)
    runSearch(query)
  }

  const handleGenreClick = (label) => {
    setQuery(label)
    router.replace(`/explore?q=${encodeURIComponent(label)}`)
    runSearch(label)
  }

  const handleAddBook = async (item) => {
    setSavingId(item.id)
    setMessage('')

    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user
    if (!user) {
      setMessage('Kamu harus login dulu.')
      setSavingId(null)
      return
    }

    const info = item.volumeInfo
    const title = info.title || 'Tanpa Judul'
    const author = info.authors ? info.authors.join(', ') : 'Unknown'
    const coverUrl =
      info.imageLinks?.thumbnail?.replace('http://', 'https://') ||
      info.imageLinks?.smallThumbnail?.replace('http://', 'https://') ||
      null
    const isbn =
      info.industryIdentifiers?.find((i) => i.type === 'ISBN_13')?.identifier ||
      info.industryIdentifiers?.find((i) => i.type === 'ISBN_10')?.identifier ||
      null
    const totalPages = info.pageCount || null
    const genre = info.categories ? info.categories[0] : null

    // Cek apakah buku sudah ada
    const { data: existingBooks } = await supabase
      .from('books')
      .select('id')
      .eq('title', title)
      .limit(1)

    let bookId

    if (existingBooks && existingBooks.length > 0) {
      bookId = existingBooks[0].id
    } else {
      const { data: newBook, error: insertError } = await supabase
        .from('books')
        .insert({ title, author, cover_url: coverUrl, isbn, total_pages: totalPages, genre })
        .select()
        .single()

      if (insertError) {
        setMessage('Gagal menyimpan buku: ' + insertError.message)
        setSavingId(null)
        return
      }
      bookId = newBook.id
    }

    const { error: userBookError } = await supabase.from('user_books').insert({
      user_id: user.id,
      book_id: bookId,
      status: 'want_to_read',
    })

    setSavingId(null)

    if (userBookError) {
      if (userBookError.code === '23505') {
        setMessage('Buku ini sudah ada di rak kamu.')
      } else {
        setMessage('Gagal menambah buku: ' + userBookError.message)
      }
    } else {
      setMessage(`"${title}" ditambahkan ke Want to Read!`)
    }
  }

  return (
    <AppShell>
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[13px] text-gray-400 mb-1">Temukan bacaan baru</p>
          <h1 className="text-3xl font-serif text-gray-900">Explore</h1>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-lg">
          <div className="flex-1 flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-orange-400 transition-colors">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-gray-400 shrink-0">
              <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM21 21l-4.3-4.3" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari judul, penulis, atau ISBN..."
              className="border-none outline-none bg-transparent text-[13.5px] text-gray-800 w-full placeholder:text-gray-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-[#1a2332] text-white text-[13.5px] font-medium rounded-xl hover:bg-[#243044] disabled:opacity-50 transition-colors"
          >
            {loading ? 'Mencari...' : 'Cari'}
          </button>
        </form>

        {/* Genre filter */}
        <section className="mb-8">
          <h2 className="text-[15px] font-semibold text-gray-700 mb-3">Jelajahi Genre</h2>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                key={g.label}
                type="button"
                onClick={() => handleGenreClick(g.label)}
                className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium border transition-opacity hover:opacity-80 ${g.color}`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </section>

        {/* Message */}
        {message && (
          <div className={`px-4 py-3 rounded-xl mb-5 text-[13px] max-w-lg ${
            message.includes('Gagal') || message.includes('harus')
              ? 'bg-red-50 text-red-700 border border-red-100'
              : 'bg-orange-50 text-orange-800 border border-orange-100'
          }`}>
            {message}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <section>
            <h2 className="text-[17px] font-serif text-gray-800 mb-4">Hasil Pencarian</h2>
            <div className="flex flex-col gap-3">
              {results.map((item) => {
                const info = item.volumeInfo
                const cover =
                  info.imageLinks?.thumbnail?.replace('http://', 'https://') ||
                  info.imageLinks?.smallThumbnail?.replace('http://', 'https://') ||
                  null

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-white border border-gray-100 rounded-2xl items-center hover:border-gray-200 transition-colors"
                  >
                    {/* Cover */}
                    <div className="w-[48px] h-[70px] rounded-lg overflow-hidden bg-orange-50 shrink-0 flex items-center justify-center">
                      {cover ? (
                        <img src={cover} alt={info.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-serif text-orange-700">{info.title?.charAt(0)}</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-semibold text-gray-900 truncate">{info.title}</p>
                      <p className="text-[12px] text-gray-500 truncate mt-0.5">
                        {info.authors ? info.authors.join(', ') : 'Penulis tidak diketahui'}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        {info.categories && (
                          <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[11px] font-medium rounded-full border border-orange-100">
                            {info.categories[0]}
                          </span>
                        )}
                        {info.pageCount && (
                          <span className="text-[11px] text-gray-400">{info.pageCount} hal.</span>
                        )}
                        {info.publishedDate && (
                          <span className="text-[11px] text-gray-400">{info.publishedDate.slice(0, 4)}</span>
                        )}
                      </div>
                    </div>

                    {/* Add button */}
                    <button
                      type="button"
                      onClick={() => handleAddBook(item)}
                      disabled={savingId === item.id}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-50 text-gray-700 text-[12.5px] font-medium rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 border border-gray-200"
                    >
                      {savingId === item.id ? (
                        'Menyimpan...'
                      ) : (
                        <>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                          Want to Read
                        </>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Empty state after search */}
        {!loading && hasSearched && results.length === 0 && !message && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-gray-300" strokeLinecap="round">
              <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM21 21l-4.3-4.3" />
            </svg>
            <p className="text-[13.5px] font-medium text-gray-500">Tidak ada hasil untuk &ldquo;{query}&rdquo;</p>
            <p className="text-[12px] text-gray-400">Coba kata kunci lain atau nama penulisnya.</p>
          </div>
        )}

        {/* Default state — belum search apapun */}
        {!hasSearched && (
          <section>
            <h2 className="text-[17px] font-serif text-gray-800 mb-4">Buku Populer</h2>
            <div className="flex flex-col items-center justify-center gap-2 py-16 border border-dashed border-gray-200 rounded-2xl bg-white/50 text-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-gray-300 mb-1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              <p className="text-[13.5px] font-medium text-gray-500">Cari buku atau pilih genre di atas</p>
              <p className="text-[12px] text-gray-400 max-w-xs">Hasil pencarian akan muncul di sini.</p>
            </div>
          </section>
        )}
      </div>
    </AppShell>
  )
}