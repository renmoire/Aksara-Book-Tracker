'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/src/lib/supabase'
import { updateBookStatus, removeFromLibrary } from '@/src/lib/userBooks'
import AppShell from '../layout/appShell'
import StatusDropdown from '../dashboard/statusDropdown'

// Genre yang dianggap bertema "gelap" -> label genre diwarnai merah.
// Selain yang ada di sini, defaultnya hijau.
const DARK_GENRES = [
  'horror',
  'thriller',
  'mystery',
  'crime',
  'true crime',
  'war',
  'dystopian',
  'tragedy',
  'psychological',
  'gothic',
  'noir',
  'misteri',
  'kriminal',
  'perang',
  'horor',
]

function isDarkGenre(genre) {
  if (!genre) return false
  return DARK_GENRES.some((g) => genre.toLowerCase().includes(g))
}

export default function BookDetail({ bookId }) {
  const router = useRouter()

  const [book, setBook] = useState(null)
  const [userBook, setUserBook] = useState(null) // row user_books milik user ini, null jika belum ada di rak
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    loadBook()
  }, [bookId])

  async function loadBook() {
    setLoading(true)

    const { data: bookData, error: bookError } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .single()

    if (bookError || !bookData) {
      setNotFound(true)
      setLoading(false)
      return
    }
    setBook(bookData)

    const { data: userData } = await supabase.auth.getUser()
    if (userData?.user) {
      const { data: userBookData } = await supabase
        .from('user_books')
        .select('*')
        .eq('user_id', userData.user.id)
        .eq('book_id', bookId)
        .maybeSingle()
      setUserBook(userBookData)
    }

    setLoading(false)
  }

  async function handleChangeStatus(newStatus) {
    if (!userBook) return
    setBusy(true)
    const { error } = await updateBookStatus(userBook.id, newStatus)
    setBusy(false)
    if (!error) loadBook()
  }

  async function handleRemove() {
    if (!userBook) return
    setBusy(true)
    const { error } = await removeFromLibrary(userBook.id)
    setBusy(false)
    if (!error) router.push('/library')
  }

  if (loading) {
    return (
      <AppShell>
        <div className="p-8 max-w-4xl mx-auto">
          <p className="text-gray-400 text-sm">Memuat buku...</p>
        </div>
      </AppShell>
    )
  }

  if (notFound) {
    return (
      <AppShell>
        <div className="p-8 max-w-4xl mx-auto">
          <BackButton onClick={() => router.back()} />
          <div className="flex flex-col items-center justify-center gap-3 py-20 border border-dashed border-gray-200 rounded-2xl bg-white/50 text-center mt-6">
            <p className="text-[14px] font-medium text-gray-500">Buku tidak ditemukan</p>
            <p className="text-[12.5px] text-gray-400 max-w-xs">
              Buku ini mungkin sudah dihapus atau link-nya salah.
            </p>
          </div>
        </div>
      </AppShell>
    )
  }

  const { title, author, cover_url, description, total_pages, genre } = book
  const dark = isDarkGenre(genre)

  return (
    <AppShell>
      <div className="p-8 max-w-4xl mx-auto">
        <BackButton onClick={() => router.back()} />

        <div className="flex gap-8 mt-6 items-start">
          {/* Cover - jelas lebih besar dari card lain di app */}
          <div className="w-[220px] aspect-[2/3] rounded-2xl bg-orange-50 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
            {cover_url ? (
              <img src={cover_url} alt={title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-6xl font-serif text-orange-700">{title?.charAt(0)}</span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-[28px] font-serif text-gray-900 leading-tight">{title}</h1>
                <p className="text-[15px] text-gray-600 mt-1.5">
                  {author}
                  {book.translator && (
                    <span className="text-gray-400"> · diterjemahkan oleh {book.translator}</span>
                  )}
                </p>
              </div>

              {/* Status dropdown di kanan, hanya jika buku ada di rak user */}
              {userBook && (
                <div className="shrink-0">
                  <StatusDropdown
                    status={userBook.status}
                    busy={busy}
                    onChangeStatus={handleChangeStatus}
                    onRemove={handleRemove}
                  />
                </div>
              )}
            </div>

            {/* Meta info: total halaman, tipe buku, tahun terbit (tampil hanya jika datanya ada) */}
            <div className="flex items-center gap-3 mt-4 text-[13px] text-gray-500 flex-wrap">
              {total_pages && (
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M4 4.5C4 3.4 4.9 3 5.5 3h13C19.1 3 20 3.4 20 4.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4.5Z" />
                    <path d="M9 3v18" />
                  </svg>
                  {total_pages} halaman
                </span>
              )}
              {book.book_type && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="capitalize">{book.book_type}</span>
                </>
              )}
              {book.published_year && (
                <>
                  <span className="text-gray-300">•</span>
                  <span>{book.published_year}</span>
                </>
              )}
            </div>

            {/* Genre */}
            {genre && (
              <p className={`text-[13px] font-medium mt-3 ${dark ? 'text-red-600' : 'text-green-600'}`}>
                {genre}
              </p>
            )}

            {/* Deskripsi */}
            <div className="mt-5">
              <h2 className="text-[13px] font-semibold text-gray-700 mb-1.5">Deskripsi</h2>
              {description ? (
                <p className="text-[13.5px] text-gray-600 leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              ) : (
                <p className="text-[13px] text-gray-400 italic">Belum ada deskripsi untuk buku ini.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-700 transition-colors"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      Kembali
    </button>
  )
}