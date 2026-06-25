'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/src/lib/supabase'
import { logReadingProgress, getJournalEntries } from '@/src/lib/readingHistory'
import { updateBookStatus, BOOK_STATUS } from '@/src/lib/userBooks'
import { getBookReviews, getMyReview } from '@/src/lib/reviews'
import { getJournalNotes } from '@/src/lib/journalNotes'
import AppShell from '../layout/appShell'
import ProgressUpdateForm from './progressUpdateForm'
import JournalList from './journalList'
import StatusSelector from './statusSelector'
import MyReviewForm from './myReviewForm'
import CommunityReviews from './communityReviews'
import JournalNoteList from './journalNoteList'

export default function BookDetail({ bookId }) {
  const router = useRouter()

  const [book, setBook]                 = useState(null)
  const [userBook, setUserBook]         = useState(null)
  const [userId, setUserId]             = useState(null)
  const [entries, setEntries]           = useState([])
  const [notes, setNotes]               = useState([])
  const [reviews, setReviews]           = useState([])
  const [myReview, setMyReview]         = useState(null)
  const [loading, setLoading]           = useState(true)
  const [message, setMessage]           = useState('')
  const [descExpanded, setDescExpanded] = useState(false)
  const [activeTab, setActiveTab]       = useState('detail')

  useEffect(() => { loadData() }, [bookId])

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
      setUserId(user.id)

      const { data: userBookData } = await supabase
        .from('user_books')
        .select('*')
        .eq('user_id', user.id)
        .eq('book_id', bookId)
        .maybeSingle()

      setUserBook(userBookData || null)

      if (userBookData) {
        const [{ data: journalEntries }, { data: journalNotes }] = await Promise.all([
          getJournalEntries(userBookData.id),
          getJournalNotes(userBookData.id),
        ])
        setEntries(journalEntries)
        setNotes(journalNotes)
      }

      const [{ data: allReviews }, { data: ownReview }] = await Promise.all([
        getBookReviews(bookId),
        getMyReview(bookId, user.id),
      ])
      setReviews(allReviews)
      setMyReview(ownReview)
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
    if (error) { setMessage('Gagal menyimpan progress: ' + error.message); return }

    const totalPages = book.total_pages || 0
    const reachedEnd = totalPages > 0 && newPage >= totalPages

    if (reachedEnd && userBook.status !== BOOK_STATUS.FINISHED) {
      const { error: statusError } = await updateBookStatus(userBook.id, BOOK_STATUS.FINISHED)
      if (!statusError) {
        setMessage('Selesai! Buku ini otomatis ditandai sebagai sudah dibaca 🎉')
        setTimeout(() => setMessage(''), 3500)
        await loadData()
        return
      }
    }

    setMessage('Progress diperbarui!')
    setTimeout(() => setMessage(''), 2500)
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

  const DESCRIPTION_THRESHOLD = 200
  const needsClamp = (book.description?.length || 0) > DESCRIPTION_THRESHOLD
  const isReading = userBook?.status === 'current_reading'

  // ─── Tab Jurnal ─────────────────────────────────────────────────────────────
  if (activeTab === 'journal') {
    return (
      <AppShell>
        <div className="p-8 max-w-3xl mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab('detail')}
            className="text-[13px] text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Kembali ke detail buku
          </button>

          <div className="mb-6">
            <h1 className="text-[17px] font-semibold text-gray-900">Jurnal bacaan</h1>
            <p className="text-[12px] text-gray-400 mt-0.5">{book.title}</p>
          </div>

          <section className="mb-8">
            <h2 className="text-[13px] font-semibold text-gray-700 mb-3">Catatan</h2>
            {userBook ? (
              <JournalNoteList
                notes={notes}
                userBookId={userBook.id}
                userId={userId}
                onNotesChanged={loadData}
              />
            ) : (
              <p className="text-[13px] text-gray-400">
                Tambahkan buku ini ke rak dulu untuk mulai menulis catatan.
              </p>
            )}
          </section>

          <section>
            <h2 className="text-[13px] font-semibold text-gray-700 mb-3">Riwayat progress</h2>
            <JournalList entries={entries} totalPages={book.total_pages || 0} />
          </section>
        </div>
      </AppShell>
    )
  }

  // ─── Tab Detail ─────────────────────────────────────────────────────────────
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

        {/* Header buku */}
        <div className="flex gap-5 mb-8">
          <div className="w-[110px] h-[160px] rounded-xl bg-orange-50 overflow-hidden shrink-0 flex items-center justify-center">
            {book.cover_url ? (
              <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-serif text-orange-700">{book.title?.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[22px] font-serif text-gray-900 mb-1 leading-snug">{book.title}</h1>
            <p className="text-[14px] text-gray-500 mb-4">{book.author}</p>
            <div className="flex flex-wrap gap-2 text-[11.5px] text-gray-400 mb-3">
              {book.total_pages && <span>{book.total_pages} halaman</span>}
              {book.isbn && <span>· ISBN {book.isbn}</span>}
            </div>
            {book.genre && (
              <span className="inline-block px-2.5 py-1 bg-orange-50 text-orange-600 text-[11.5px] font-medium rounded-full border border-orange-100">
                {book.genre}
              </span>
            )}
          </div>
        </div>

        {/* Status */}
        {userBook && (
          <div className="mb-6">
            <StatusSelector
              userBookId={userBook.id}
              currentStatus={userBook.status}
              onStatusChanged={(newStatus) =>
                setUserBook((prev) => ({ ...prev, status: newStatus }))
              }
            />
          </div>
        )}

        {/* Deskripsi */}
        {book.description && (
          <div className="mb-6">
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-2">
              Deskripsi
            </p>
            <p className={`text-[13.5px] text-gray-600 leading-relaxed ${needsClamp && !descExpanded ? 'line-clamp-4' : ''}`}>
              {book.description}
            </p>
            {needsClamp && (
              <button
                type="button"
                onClick={() => setDescExpanded((v) => !v)}
                className="mt-1.5 text-[12.5px] text-gray-400 hover:text-gray-700 underline underline-offset-2 transition-colors"
              >
                {descExpanded ? 'tampilkan lebih sedikit' : 'tampilkan lebih'}
              </button>
            )}
          </div>
        )}

        {/* Progress — hanya muncul kalau status sedang dibaca */}
        {userBook && isReading && (
          <div className="mb-6">
            <ProgressUpdateForm
              currentPage={userBook.current_page || 0}
              totalPages={book.total_pages || 0}
              onSubmit={handleUpdateProgress}
            />
          </div>
        )}
        {userBook && !isReading && (
          <p className="text-[12.5px] text-gray-400 mb-6 px-1">
            Ubah status ke <span className="font-medium text-gray-600">Sedang dibaca</span> untuk update progress.
          </p>
        )}

        {message && (
          <p className="px-4 py-2.5 bg-orange-50 text-orange-800 rounded-xl mb-4 text-[13px]">{message}</p>
        )}

        {/* Tombol ke jurnal */}
        {userBook && (
          <div className="mb-8">
            <button
              type="button"
              onClick={() => setActiveTab('journal')}
              className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-4 py-3.5 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  <line x1="9" y1="9" x2="15" y2="9" />
                  <line x1="9" y1="13" x2="13" y2="13" />
                </svg>
                <div className="text-left">
                  <p className="text-[13.5px] font-medium text-gray-800">Jurnal bacaan</p>
                  <p className="text-[11.5px] text-gray-400">
                    {notes.length + entries.length > 0
                      ? `${notes.length} catatan · ${entries.length} riwayat progress`
                      : 'Belum ada catatan'}
                  </p>
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}

        {!userBook && (
          <p className="text-[13px] text-gray-400 mb-8">
            Buku ini belum ada di rak kamu. Tambahkan dari halaman Explore atau Search untuk mulai mencatat progres.
          </p>
        )}

        {/* Review saya */}
        {userBook && userId && (
          <div className="mb-8">
            <MyReviewForm
              bookId={bookId}
              userId={userId}
              existingReview={myReview}
              onSaved={(saved) => setMyReview(saved)}
            />
          </div>
        )}

        {/* Review komunitas */}
        <section>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-4">
            Ulasan komunitas
          </p>
          <CommunityReviews reviews={reviews.filter((r) => r.user_id !== userId)} />
        </section>
      </div>
    </AppShell>
  )
}