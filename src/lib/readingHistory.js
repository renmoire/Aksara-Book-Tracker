import { supabase } from './supabase'

/**
 * Catat progress baca baru untuk satu buku di rak user, dan otomatis:
 * - hitung berapa halaman yang dibaca sejak entry terakhir
 * - simpan entry baru di reading_history (untuk journal)
 * - update current_page di user_books (supaya progress bar dashboard ikut update)
 *
 * @param {object} params
 * @param {string} params.userBookId - id row di user_books
 * @param {string} params.bookId - id row di books
 * @param {number} params.newPage - halaman absolut yang baru (input user)
 * @param {number} params.previousPage - halaman sebelumnya (current_page lama), untuk hitung selisih
 * @returns {Promise<{ data, error }>}
 */
export async function logReadingProgress({ userBookId, bookId, newPage, previousPage }) {
  const pagesReadToday = Math.max(0, newPage - (previousPage || 0))

  // 1. Simpan entry journal
  const { data: entry, error: entryError } = await supabase
    .from('reading_history')
    .insert({
      user_book_id: userBookId,
      book_id: bookId,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
      pages_read: pagesReadToday,
      page_at_entry: newPage,
    })
    .select()
    .single()

  if (entryError) {
    return { data: null, error: entryError }
  }

  // 2. Update current_page di user_books supaya dashboard ikut berubah
  const { error: updateError } = await supabase
    .from('user_books')
    .update({ current_page: newPage })
    .eq('id', userBookId)

  if (updateError) {
    return { data: entry, error: updateError }
  }

  return { data: entry, error: null }
}

/**
 * Ambil semua journal entries untuk satu buku di rak user, urut dari terbaru.
 *
 * @param {string} userBookId - id row di user_books
 * @returns {Promise<{ data, error }>}
 */
export async function getJournalEntries(userBookId) {
  const { data, error } = await supabase
    .from('reading_history')
    .select('*')
    .eq('user_book_id', userBookId)
    .order('created_at', { ascending: false })

  return { data: data || [], error }
}