"use client";

import "./ShelfRow.css";

/**
 * ShelfRow
 * --------
 * Baris koleksi/rak buku di bagian bawah dashboard.
 * props:
 * - shelves: [{ id, name, bookCount, coverUrls: [url, url, url] }]
 */
export default function ShelfRow({ shelves = [], onShelfClick }) {
  return (
    <section className="aksara-shelfrow">
      <div className="aksara-shelfrow__head">
        <h2>Koleksi</h2>
      </div>

      <div className="aksara-shelfrow__list">
        {shelves.map((shelf) => (
          <button
            key={shelf.id}
            type="button"
            className="aksara-shelfrow__item"
            onClick={() => onShelfClick?.(shelf)}
          >
            <div className="aksara-shelfrow__stack">
              {(shelf.coverUrls || []).slice(0, 3).map((url, i) => (
                <span
                  key={i}
                  className="aksara-shelfrow__stack-piece"
                  style={{ backgroundImage: url ? `url(${url})` : undefined }}
                />
              ))}
              {(!shelf.coverUrls || shelf.coverUrls.length === 0) && (
                <span className="aksara-shelfrow__stack-piece aksara-shelfrow__stack-piece--empty" />
              )}
            </div>
            <p className="aksara-shelfrow__name">{shelf.name}</p>
            <p className="aksara-shelfrow__count">{shelf.bookCount} buku</p>
          </button>
        ))}
      </div>
    </section>
  );
}