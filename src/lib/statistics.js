import { supabase } from './supabase'

/**
 * Ambil semua data yang dibutuhkan halaman statistik untuk satu user & tahun.
 * Satu fungsi, satu round-trip paralel.
 */
export async function getStatistics(userId, year) {
  const yearStart = `${year}-01-01`
  const yearEnd   = `${year}-12-31`

  const [
    { data: finishedBooks },
    { data: allUserBooks },
    { data: readingHistory },
  ] = await Promise.all([
    // Buku selesai di tahun ini (pakai finished_at)
    supabase
      .from('user_books')
      .select('*, books(title, author, cover_url, total_pages, genre)')
      .eq('user_id', userId)
      .eq('status', 'finished')
      .gte('finished_at', yearStart)
      .lte('finished_at', yearEnd)
      .order('finished_at', { ascending: false }),

    // Semua buku di rak (untuk hitung want/current/finished total)
    supabase
      .from('user_books')
      .select('status, started_at, finished_at, current_page, books(total_pages, genre)')
      .eq('user_id', userId),

    // Semua reading_history di tahun ini (untuk halaman per bulan & streak)
    supabase
      .from('reading_history')
      .select('date, pages_read')
      .eq('user_id', userId)
      .gte('date', yearStart)
      .lte('date', yearEnd)
      .order('date', { ascending: true }),
  ])

  return {
    finishedBooks: finishedBooks || [],
    allUserBooks:  allUserBooks  || [],
    readingHistory: readingHistory || [],
  }
}