"use client";

import "./ActivityFeed.css";

/**
 * ActivityFeed
 * ------------
 * Panel kanan, daftar aktivitas baca terbaru.
 * props:
 * - activities: [{ id, bookTitle, type: "progress"|"finished"|"started"|"review", detail, timeAgo }]
 */
const TYPE_LABEL = {
  progress: "Update progres",
  finished: "Selesai dibaca",
  started: "Mulai membaca",
  review: "Menulis catatan",
};

const TYPE_DOT = {
  progress: "var(--aksara-reading)",
  finished: "var(--aksara-done)",
  started: "var(--aksara-wishlist)",
  review: "var(--aksara-accent)",
};

export default function ActivityFeed({ activities = [] }) {
  return (
    <aside className="aksara-activity">
      <div className="aksara-activity__head">
        <h2>Aktivitas Terbaru</h2>
      </div>

      {activities.length === 0 ? (
        <p className="aksara-activity__empty">Belum ada aktivitas minggu ini.</p>
      ) : (
        <ol className="aksara-activity__list">
          {activities.map((item) => (
            <li key={item.id}>
              <span
                className="aksara-activity__dot"
                style={{ background: TYPE_DOT[item.type] || "var(--aksara-ink-faint)" }}
              />
              <div className="aksara-activity__body">
                <p className="aksara-activity__title">{item.bookTitle}</p>
                <p className="aksara-activity__detail">
                  {TYPE_LABEL[item.type] || "Aktivitas"}
                  {item.detail ? ` · ${item.detail}` : ""}
                </p>
              </div>
              <span className="aksara-activity__time">{item.timeAgo}</span>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}