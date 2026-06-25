import { supabase } from './supabase'

/**
 * Status yang valid untuk user_books.status
 */
export const BOOK_STATUS = {
  WANT_TO_READ: 'want_to_read',
  CURRENT_READING: 'current_reading',
  FINISHED: 'finished',
}

export const STATUS_LABEL = {
  [BOOK_STATUS.WANT_TO_READ]: 'To Read',
  [BOOK_STATUS.CURRENT_READING]: 'Sedang Dibaca',
  [BOOK_STATUS.FINISHED]: 'Selesai',
}

/**
 * Ubah status sebuah buku di rak user (row user_books).
 * Otomatis mengisi started_at saat pindah ke "current_reading"
 * dan finished_at saat pindah ke "finished".
 *
 * @param {string} userBookId - id row di tabel user_books
 * @param {string} newStatus - salah satu dari BOOK_STATUS
 * @returns {Promise<{ data, error }>}
 */
export async function updateBookStatus(userBookId, newStatus) {
  const patch = { status: newStatus }

  if (newStatus === BOOK_STATUS.CURRENT_READING) {
    patch.started_at = new Date().toISOString()
  }
  if (newStatus === BOOK_STATUS.FINISHED) {
    patch.finished_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('user_books')
    .update(patch)
    .eq('id', userBookId)
    .select()
    .single()

  return { data, error }
}

/**
 * Hapus buku dari rak user (row user_books).
 * Tidak menghapus row di tabel books (data buku tetap ada untuk user lain).
 *
 * @param {string} userBookId - id row di tabel user_books
 * @returns {Promise<{ error }>}
 */
export async function removeFromLibrary(userBookId) {
  const { error } = await supabase
    .from('user_books')
    .delete()
    .eq('id', userBookId)

  return { error }
}