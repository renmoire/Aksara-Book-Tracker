"use client";

import "./Sidebar.css";

const NAV_ITEMS = [
  { key: "overview", label: "Ringkasan", icon: "home" },
  { key: "reading", label: "Sedang Dibaca", icon: "book-open" },
  { key: "finished", label: "Selesai", icon: "check" },
  { key: "wishlist", label: "Wishlist", icon: "bookmark" },
];

const SHELVES = [
  { key: "fiction", label: "Fiksi Favorit", count: 12 },
  { key: "nonfiction", label: "Non-Fiksi", count: 7 },
  { key: "rereads", label: "Baca Ulang", count: 3 },
];

function Icon({ name }) {
  // Set ikon minimal, line-style, biar konsisten tanpa nambah dependency.
  const paths = {
    home: "M3 10.5 12 3l9 7.5M5 9.5V20h14V9.5",
    "book-open": "M12 6.5c-2-1.5-5-2-8-1.5v12c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5Z",
    check: "M4 12.5 9 17l11-11",
    bookmark: "M7 3.5h10v17l-5-3.5-5 3.5Z",
    search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM21 21l-4.3-4.3",
    settings: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM4 12h2M18 12h2M12 4v2M12 18v2M6 6l1.4 1.4M16.6 16.6 18 18M18 6l-1.4 1.4M7.4 16.6 6 18",
  };
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name] || paths.home} />
    </svg>
  );
}

export default function Sidebar({ user, activeKey = "overview", onNavigate, readingGoal }) {
  const goalPercent = readingGoal
    ? Math.min(100, Math.round((readingGoal.current / readingGoal.target) * 100))
    : 0;

  return (
    <aside className="aksara-sidebar">
      <div className="aksara-sidebar__brand">
        <span className="aksara-sidebar__mark">A</span>
        <span className="aksara-sidebar__name">Aksara</span>
      </div>

      <div className="aksara-sidebar__user">
        <div className="aksara-sidebar__avatar">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user?.name || "Pengguna"} />
          ) : (
            <span>{(user?.name || "A").charAt(0)}</span>
          )}
        </div>
        <div className="aksara-sidebar__user-info">
          <p className="aksara-sidebar__user-name">{user?.name || "Pembaca"}</p>
          <p className="aksara-sidebar__user-sub">{user?.booksThisYear ?? 0} buku tahun ini</p>
        </div>
      </div>

      <nav className="aksara-sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`aksara-sidebar__nav-item ${activeKey === item.key ? "is-active" : ""}`}
            onClick={() => onNavigate?.(item.key)}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="aksara-sidebar__section">
        <p className="aksara-sidebar__section-title">Rak Kamu</p>
        <ul className="aksara-sidebar__shelves">
          {SHELVES.map((shelf) => (
            <li key={shelf.key}>
              <button type="button" onClick={() => onNavigate?.(`shelf:${shelf.key}`)}>
                <span>{shelf.label}</span>
                <span className="aksara-sidebar__shelf-count">{shelf.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {readingGoal && (
        <div className="aksara-sidebar__goal">
          <p className="aksara-sidebar__goal-label">
            Target {readingGoal.year}
          </p>
          <div className="aksara-sidebar__goal-bar">
            <div
              className="aksara-sidebar__goal-fill"
              style={{ width: `${goalPercent}%` }}
            />
          </div>
          <p className="aksara-sidebar__goal-count">
            {readingGoal.current} / {readingGoal.target} buku
          </p>
        </div>
      )}
    </aside>
  );
}