"use client";

import "./dashboard.css";
import Sidebar from "./sidebar";
import BookGrid from "./bookGrid";
import ActivityFeed from "./toReadPile";
import ShelfRow from "./shelfRow";

/**
 * Dashboard
 * ---------
 * Halaman dashboard utama. Susunan: Sidebar | (Topbar, Sedang Dibaca,
 * Rekomendasi, Koleksi) | Aktivitas Terbaru.
 *
 * Semua data di bawah ini DUMMY, ganti dengan data dari Supabase kamu.
 * Bentuk data sudah disesuaikan dengan props yang dipakai tiap komponen
 * di file masing-masing (lihat komentar di atas tiap komponen).
 */

const DUMMY_USER = {
  name: "Ren",
  booksThisYear: 14,
  avatarUrl: null,
};

const DUMMY_GOAL = { year: 2026, current: 14, target: 24 };

const DUMMY_READING = [
  { id: "1", title: "Laut Bercerita", author: "Leila S. Chudori", progress: 62 },
  { id: "2", title: "Pulang", author: "Leila S. Chudori", progress: 30 },
  { id: "3", title: "Atomic Habits", author: "James Clear", progress: 85 },
];

const DUMMY_RECOMMENDED = [
  { id: "4", title: "Bumi Manusia", author: "Pramoedya A.T.", rating: 5 },
  { id: "5", title: "Filosofi Teras", author: "Henry Manampiring", rating: 4 },
  { id: "6", title: "Sapiens", author: "Yuval N. Harari", rating: 5 },
  { id: "7", title: "Cantik Itu Luka", author: "Eka Kurniawan", rating: 4 },
  { id: "8", title: "Gadis Kretek", author: "Ratih Kumala", rating: 4 },
];

const DUMMY_ACTIVITY = [
  { id: "a1", bookTitle: "Laut Bercerita", type: "progress", detail: "Bab 9", timeAgo: "2j" },
  { id: "a2", bookTitle: "Atomic Habits", type: "progress", detail: "Bab 4", timeAgo: "5j" },
  { id: "a3", bookTitle: "Filosofi Teras", type: "finished", timeAgo: "1h" },
  { id: "a4", bookTitle: "Sapiens", type: "started", timeAgo: "2h" },
  { id: "a5", bookTitle: "Pulang", type: "review", detail: "1 catatan baru", timeAgo: "3h" },
];

const DUMMY_SHELVES = [
  { id: "s1", name: "Fiksi Favorit", bookCount: 12, coverUrls: [] },
  { id: "s2", name: "Non-Fiksi", bookCount: 7, coverUrls: [] },
  { id: "s3", name: "Baca Ulang", bookCount: 3, coverUrls: [] },
  { id: "s4", name: "Wishlist", bookCount: 9, coverUrls: [] },
];

export default function Dashboard() {
  return (
    <div className="aksara-dashboard">
      <Sidebar user={DUMMY_USER} activeKey="overview" readingGoal={DUMMY_GOAL} />

      <main className="aksara-dashboard__main">
        <header className="aksara-dashboard__topbar">
          <div>
            <p className="aksara-dashboard__greeting">Selamat datang kembali,</p>
            <h1>{DUMMY_USER.name}</h1>
          </div>
          <div className="aksara-dashboard__search">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM21 21l-4.3-4.3" />
            </svg>
            <input type="text" placeholder="Cari buku, penulis..." />
          </div>
        </header>

        <BookGrid
          title="Sedang Dibaca"
          books={DUMMY_READING}
          layout="scroll-wide"
          onSeeAll={() => {}}
        />

        <BookGrid
          title="Rekomendasi Untukmu"
          books={DUMMY_RECOMMENDED}
          layout="grid"
          onSeeAll={() => {}}
        />

        <ShelfRow shelves={DUMMY_SHELVES} />
      </main>

      <ActivityFeed activities={DUMMY_ACTIVITY} />
    </div>
  );
}