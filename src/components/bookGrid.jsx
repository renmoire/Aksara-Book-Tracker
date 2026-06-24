"use client";

import "./bookGrid.css";
import BookCard from "./bookCard";

/**
 * BookGrid
 * --------
 * props:
 * - title: judul section, misal "Sedang Dibaca"
 * - books: array book object (lihat BookCard)
 * - layout: "scroll-wide" (rak sedang dibaca, horizontal scroll, card wide)
 *          | "grid"        (rekomendasi, grid kolom, card grid)
 * - onSeeAll, onBookClick
 */
export default function BookGrid({ title, books = [], layout = "grid", onSeeAll, onBookClick }) {
  return (
    <section className="aksara-bookgrid">
      <div className="aksara-bookgrid__head">
        <h2>{title}</h2>
        {onSeeAll && (
          <button type="button" className="aksara-bookgrid__seeall" onClick={onSeeAll}>
            Lihat semua
          </button>
        )}
      </div>

      {books.length === 0 ? (
        <p className="aksara-bookgrid__empty">Belum ada buku di sini.</p>
      ) : layout === "scroll-wide" ? (
        <div className="aksara-bookgrid__scroll">
          {books.map((book) => (
            <BookCard key={book.id} book={book} variant="wide" onClick={onBookClick} />
          ))}
        </div>
      ) : (
        <div className="aksara-bookgrid__grid">
          {books.map((book) => (
            <BookCard key={book.id} book={book} variant="grid" onClick={onBookClick} />
          ))}
        </div>
      )}
    </section>
  );
}