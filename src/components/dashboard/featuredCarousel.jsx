'use client'

import { useState, useEffect } from 'react'

/**
 * Ekstrak dominant color dari URL gambar via Canvas.
 * Menghindari pixel yang terlalu gelap/terang supaya hasilnya lebih representatif.
 * Fallback ke null jika CORS diblokir atau gambar gagal dimuat.
 */
function extractDominantColor(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      try {
        const W = 40, H = 40
        const canvas = document.createElement('canvas')
        canvas.width = W
        canvas.height = H
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, W, H)
        const { data } = ctx.getImageData(0, 0, W, H)

        let r = 0, g = 0, b = 0, n = 0
        for (let i = 0; i < data.length; i += 4) {
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
          // Skip pixel yg terlalu putih atau terlalu hitam
          if (brightness > 20 && brightness < 230) {
            r += data[i]
            g += data[i + 1]
            b += data[i + 2]
            n++
          }
        }

        if (n === 0) return resolve(null)
        resolve([Math.round(r / n), Math.round(g / n), Math.round(b / n)])
      } catch {
        resolve(null) // SecurityError jika CORS diblokir
      }
    }

    img.onerror = () => resolve(null)
    img.src = url
  })
}

/** Single carousel card dengan dominant-color overlay */
function FeaturedCard({ book, onBookClick }) {
  const [rgb, setRgb] = useState(null)

  useEffect(() => {
    if (!book.coverUrl) return
    let cancelled = false
    extractDominantColor(book.coverUrl).then((color) => {
      if (!cancelled) setRgb(color)
    })
    return () => { cancelled = true }
  }, [book.coverUrl])

  // Overlay style: pakai dominant color jika berhasil, fallback ke white
  const overlayStyle = rgb
    ? {
        background: `linear-gradient(to right,
          rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.22) 0%,
          rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.22) 55%,
          rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.42) 100%)`,
      }
    : undefined

  return (
    <button
      type="button"
      onClick={() => onBookClick?.(book)}
      className="min-w-[380px] max-w-[420px] rounded-md overflow-hidden relative h-[200px] flex items-center gap-5 p-5 shrink-0 bg-gray-800 text-left hover:opacity-95 transition-opacity"
    >
      {/* Backdrop: cover di-blur jadi warna ambient penuh kartu */}
      {book.coverUrl && (
        <div
          className="absolute inset-0 scale-79"
          style={{
            backgroundImage: `url(${book.coverUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(17px) saturate(1.3)',
          }}
        />
      )}

      {/* Overlay gradient — ikut dominant color cover, fallback ke white */}
      <div
        className={`absolute inset-0${!rgb ? ' bg-gradient-to-r from-white/20 via-white/20 to-white/39' : ''}`}
        style={overlayStyle}
      />

      {/* Cover tajam di kiri */}
      <div className="relative z-10 w-[100px] h-[148px] rounded-md overflow-hidden shrink-0 shadow-lg bg-orange-50 flex items-center justify-center">
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl font-serif text-orange-700">{book.title?.charAt(0)}</span>
        )}
      </div>

      {/* Info */}
      <div className="relative z-10 flex-1 min-w-0">
        <p className="text-[18px] font-semibold text-white line-clamp-1 leading-snug">
          {book.title}
        </p>
        <p className="text-[13.5px] text-white/80 truncate mt-0.5">{book.author}</p>

        {typeof book.rating === 'number' && (
          <div className="mt-2.5 text-[17px] tracking-wide">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < book.rating ? 'text-orange-400' : 'text-white/25'}>
                ★
              </span>
            ))}
          </div>
        )}

        {book.reviewText && (
          <p className="text-[12.5px] text-white/75 mt-2.5 line-clamp-3 leading-relaxed">
            {book.reviewText}
          </p>
        )}
      </div>
    </button>
  )
}

/**
 * FeaturedCarousel
 * -----------------
 * Kartu besar di bagian atas dashboard, untuk highlight buku yang sudah diberi
 * rating oleh user. Cover asli tampil tajam di kiri, sementara seluruh kartu
 * memakai cover yang sama sebagai backdrop blur untuk warna ambient.
 *
 * props:
 * - title: string
 * - books: [{ id, title, author, coverUrl, rating, reviewText? }]
 * - onBookClick: (book) => void
 */
export default function FeaturedCarousel({ title = 'Rilis Terbaru', books = [], onBookClick }) {
  if (books.length === 0) return null

  return (
    <section>
      <div className="flex items-baseline justify-between mb-3.5">
        <h2 className="text-[19px] font-serif text-gray-900 font-medium">{title}</h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-1">
        {books.map((book) => (
          <FeaturedCard key={book.id} book={book} onBookClick={onBookClick} />
        ))}
      </div>
    </section>
  )
}