"use client";

import "./bookCard.css";

/**
 * BookCard
 * --------
 * Satu kartu buku. Dipakai di rak "Sedang Dibaca" dan grid "Rekomendasi".
 *
 * props:
 * - book: { title, author, coverUrl, progress (0-100, optional), rating (0-5, optional) }
 * - variant: "wide" (untuk rak sedang dibaca, ada progress bar)
 *           | "grid"  (untuk grid rekomendasi, ada rating bintang)
 * - onClick
 */
export default function BookCard({ book, variant = "grid", onClick }) {
  const { title, author, coverUrl, progress, rating } = book;

  return (
    <button
      type="button"
      className={`aksara-bookcard aksara-bookcard--${variant}`}
      onClick={() => onClick?.(book)}
    >
      <div className="aksara-bookcard__cover">
        {coverUrl ? (
          <img src={coverUrl} alt={title} />
        ) : (
          <span className="aksara-bookcard__cover-fallback">{title?.charAt(0)}</span>
        )}
      </div>

      <div className="aksara-bookcard__info">
        <p className="aksara-bookcard__title">{title}</p>
        <p className="aksara-bookcard__author">{author}</p>

        {variant === "wide" && typeof progress === "number" && (
          <div className="aksara-bookcard__progress">
            <div className="aksara-bookcard__progress-bar">
              <div
                className="aksara-bookcard__progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="aksara-bookcard__progress-label">{progress}%</span>
          </div>
        )}

        {variant === "grid" && typeof rating === "number" && (
          <div className="aksara-bookcard__rating" aria-label={`Rating ${rating} dari 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < rating ? "is-filled" : ""}>
                ★
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}