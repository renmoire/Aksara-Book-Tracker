'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Sidebar from '../../components/sidebar'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [savingId, setSavingId] = useState(null)
  const [message, setMessage] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setMessage('')

    try {
      // fields= membatasi data yang dibalas Open Library, termasuk minta "subject"
      // supaya kita bisa simpan genre kasar tanpa fetch tambahan per buku.
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          query
        )}&limit=10&fields=key,title,author_name,cover_i,isbn,number_of_pages_median,subject`
      )
      const data = await res.json()
      setResults(data.docs || [])
    } catch (err) {
      setMessage('Gagal mengambil data. Coba lagi.')
    }

    setLoading(false)
  }

  const handleAddBook = async (book) => {
    setSavingId(book.key)
    setMessage('')

    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user

    if (!user) {
      setMessage('Kamu harus login dulu.')
      setSavingId(null)
      return
    }

    const isbn = book.isbn ? book.isbn[0] : null
    const coverId = book.cover_i
    const coverUrl = coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : null

    // Ambil subject pertama sebagai genre kasar. Open Library subject itu
    // istilah bebas (bukan daftar tertutup), jadi kita pakai apa adanya.
    const genre = book.subject && book.subject.length > 0 ? book.subject[0] : null

    // 1. Cek apakah buku sudah ada di tabel books (cari berdasarkan judul)
    const { data: existingBooks } = await supabase
      .from('books')
      .select('id')
      .eq('title', book.title)
      .limit(1)

    let bookId

    if (existingBooks && existingBooks.length > 0) {
      bookId = existingBooks[0].id
    } else {
      // 2. Kalau belum ada, insert buku baru (termasuk genre)
      const { data: newBook, error: insertError } = await supabase
        .from('books')
        .insert({
          title: book.title,
          author: book.author_name ? book.author_name.join(', ') : 'Unknown',
          cover_url: coverUrl,
          isbn: isbn,
          total_pages: book.number_of_pages_median || null,
          genre: genre,
        })
        .select()
        .single()

      if (insertError) {
        setMessage('Gagal menyimpan buku: ' + insertError.message)
        setSavingId(null)
        return
      }
      bookId = newBook.id
    }

    // 3. Masukkan ke user_books dengan status want_to_read
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
      setMessage(`"${book.title}" ditambahkan ke Want to Read!`)
    }
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-7 max-w-3xl">
        <h1 className="text-2xl font-serif text-gray-900 mb-5">Cari Buku</h1>

        <form onSubmit={handleSearch} className="flex gap-2 mb-5">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul buku..."
            className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 outline-none focus:border-orange-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Mencari...' : 'Cari'}
          </button>
        </form>

        {message && (
          <p className="px-3.5 py-2.5 bg-orange-50 text-orange-800 rounded-lg mb-4 text-sm">
            {message}
          </p>
        )}

        <div className="flex flex-col">
          {results.map((book) => (
            <div
              key={book.key}
              className="flex gap-4 p-3 border-b border-gray-100 items-center"
            >
              {book.cover_i ? (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
                  alt={book.title}
                  className="w-[50px] h-[75px] object-cover rounded-md shrink-0"
                />
              ) : (
                <div className="w-[50px] h-[75px] bg-gray-100 rounded-md shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{book.title}</p>
                <p className="text-gray-500 text-sm truncate">
                  {book.author_name ? book.author_name.join(', ') : 'Unknown author'}
                </p>
              </div>
              <button
                onClick={() => handleAddBook(book)}
                disabled={savingId === book.key}
                className="px-3 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 disabled:opacity-50 text-sm whitespace-nowrap shrink-0"
              >
                {savingId === book.key ? 'Menyimpan...' : '+ Want to Read'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}