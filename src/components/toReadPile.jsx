"use client";

import "./toReadPile.css";

/**
 * Icon hati sederhana, line-style, biar konsisten sama Icon di sidebar.jsx
 * (gak nambah dependency/library baru)
 */
function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20s-7-4.5-9.5-9C.5 7.5 2 4 5.5 4 8 4 9.5 5.5 12 8c2.5-2.5 4-4 6.5-4C22 4 23.5 7.5 21.5 11 19 15.5 12 20 12 20Z" />
    </svg>
  );
}

/**
 * ToReadPile
 * ----------
 * Panel kanan, daftar antrian buku yang mau dibaca (ranking).
 * props:
 * - books: [{ id, title, percent (opsional), favorite (boolean) }]
 */
export default function ToReadPile({ books = [], onToggleFavorite }) {
  return (
    <aside className="aksara-toread">
      <div className="aksara-toread__head">
        <h2>To-Read Pile</h2>
      </div>

      {books.length === 0 ? (
        <p className="aksara-toread__empty">Belum ada buku di antrian.</p>
      ) : (
        <ol className="aksara-toread__list">
          {books.map((book, index) => (
            <li key={book.id}>
              <span className="aksara-toread__rank">{index + 1}</span>
              <span className="aksara-toread__title">{book.title}</span>

              {typeof book.percent === "number" && (
                <span className="aksara-toread__percent">{book.percent}%</span>
              )}

              <button
                type="button"
                className={`aksara-toread__favorite ${book.favorite ? "is-active" : ""}`}
                onClick={() => onToggleFavorite?.(book.id)}
                aria-label="Tandai favorit"
              >
                <HeartIcon filled={book.favorite} />
              </button>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}