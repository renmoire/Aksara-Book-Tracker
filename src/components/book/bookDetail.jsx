'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/src/lib/supabase'
import { logReadingProgress, getJournalEntries } from '@/src/lib/readingHistory'
import AppShell from '../layout/appShell'
import ProgressUpdateForm from './progressUpdateForm'
import JournalList from './journalList'

export default function BookDetail({ bookId }) {
  const router = useRouter()

  const [book, setBook] = useState(null)
  const [userBook, setUserBook] = useState(null) // row user_books, kalau buku ini ada di rak user
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId])

  async function loadData() {
    setLoading(true)

    const { data: bookData, error: bookError } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .single()

    if (bookError || !bookData) {
      setMessage('Buku tidak ditemukan.')
      setLoading(false)
      return
    }
    setBook(bookData)

    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user

    if (user) {
      const { data: userBookData } = await supabase
        .from('user_books')
        .select('*')
        .eq('user_id', user.id)
        .eq('book_id', bookId)
        .maybeSingle()

      setUserBook(userBookData || null)

      if (userBookData) {
        const { data: journalEntries } = await getJournalEntries(userBookData.id)
        setEntries(journalEntries)
      }
    }

    setLoading(false)
  }

  async function handleUpdateProgress(newPage) {
    if (!userBook) return

    const { error } = await logReadingProgress({
      userBookId: userBook.id,
      bookId: book.id,
      newPage,
      previousPage: userBook.current_page || 0,
    })

    if (error) {
      setMessage('Gagal menyimpan progress: ' + error.message)
      return
    }

    setMessage('Progress berhasil diperbarui!')
    await loadData()
  }

  if (loading) {
    return (
      <AppShell>
        <div className="p-8">
          <p className="text-gray-400 text-sm">Memuat...</p>
        </div>
      </AppShell>
    )
  }

  if (!book) {
    return (
      <AppShell>
        <div className="p-8">
          <p className="text-gray-500 text-sm">{message || 'Buku tidak ditemukan.'}</p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="p-8 max-w-3xl mx-auto">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-[13px] text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1.5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Kembali
        </button>

        {/* Info buku */}
        <div className="flex gap-5 mb-8">
          <div className="w-[110px] h-[160px] rounded-xl bg-orange-50 overflow-hidden shrink-0 flex items-center justify-center">
            {book.cover_url ? (
              <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-serif text-orange-700">{book.title?.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-serif text-gray-900 mb-1">{book.title}</h1>
            <p className="text-gray-500 mb-3">{book.author}</p>
            {book.genre && (
              <span className="inline-block px-2.5 py-1 bg-orange-50 text-orange-600 text-[11.5px] font-medium rounded-full border border-orange-100">
                {book.genre}
              </span>
            )}
            {book.description && (
              <p className="text-[13.5px] text-gray-600 mt-4 leading-relaxed">{book.description}</p>
            )}
          </div>
        </div>

        {message && (
          <p className="px-4 py-3 bg-orange-50 text-orange-800 rounded-xl mb-5 text-[13px]">{message}</p>
        )}

        {/* Progress & journal, hanya kalau buku ada di rak user */}
        {userBook ? (
          <div className="flex flex-col gap-6">
            <ProgressUpdateForm
              currentPage={userBook.current_page || 0}
              totalPages={book.total_pages || 0}
              onSubmit={handleUpdateProgress}
            />

            <section>
              <h2 className="text-[17px] font-serif text-gray-900 mb-3.5">Catatan Baca</h2>
              <JournalList entries={entries} totalPages={book.total_pages || 0} />
            </section>
          </div>
        ) : (
          <p className="text-[13px] text-gray-400">
            Buku ini belum ada di rak kamu. Tambahkan dulu dari halaman Explore atau Search untuk mulai mencatat progres.
          </p>
        )}
      </div>
    </AppShell>
  )
}