'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

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
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`
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
      // 2. Kalau belum ada, insert buku baru
      const { data: newBook, error: insertError } = await supabase
        .from('books')
        .insert({
          title: book.title,
          author: book.author_name ? book.author_name.join(', ') : 'Unknown',
          cover_url: coverUrl,
          isbn: isbn,
          total_pages: book.number_of_pages_median || null,
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
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '20px' }}>
      <h1>Cari Buku</h1>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari judul buku..."
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #888',
            borderRadius: '4px',
            backgroundColor: '#fff',
            color: '#000',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Mencari...' : 'Cari'}
        </button>
      </form>

      {message && (
        <p style={{ padding: '10px', backgroundColor: '#222', borderRadius: '4px' }}>
          {message}
        </p>
      )}

      <div>
        {results.map((book) => (
          <div
            key={book.key}
            style={{
              display: 'flex',
              gap: '16px',
              padding: '12px',
              borderBottom: '1px solid #333',
              alignItems: 'center',
            }}
          >
            {book.cover_i ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
                alt={book.title}
                style={{ width: '50px', height: '75px', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ width: '50px', height: '75px', backgroundColor: '#333' }} />
            )}
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 'bold', margin: 0 }}>{book.title}</p>
              <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>
                {book.author_name ? book.author_name.join(', ') : 'Unknown author'}
              </p>
            </div>
            <button
              onClick={() => handleAddBook(book)}
              disabled={savingId === book.key}
              style={{
                padding: '8px 12px',
                backgroundColor: '#444',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {savingId === book.key ? 'Menyimpan...' : '+ Want to Read'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}