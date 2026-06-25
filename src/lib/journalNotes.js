import { supabase } from './supabase'

/**
 * Ambil semua catatan jurnal teks untuk satu user_book.
 * Ini berbeda dari reading_history (yang track halaman) —
 * tabel journal_notes menyimpan catatan bebas dari user.
 *
 * @param {string} userBookId
 * @returns {Promise<{ data, error }>}
 */
export async function getJournalNotes(userBookId) {
  const { data, error } = await supabase
    .from('journal_notes')
    .select('*')
    .eq('user_book_id', userBookId)
    .order('created_at', { ascending: false })

  return { data: data || [], error }
}

/**
 * Tambah catatan jurnal baru.
 *
 * @param {object} params
 * @param {string} params.userBookId
 * @param {string} params.userId
 * @param {string} params.body - teks catatan
 * @returns {Promise<{ data, error }>}
 */
export async function addJournalNote({ userBookId, userId, body }) {
  const { data, error } = await supabase
    .from('journal_notes')
    .insert({ user_book_id: userBookId, user_id: userId, body })
    .select()
    .single()

  return { data, error }
}

/**
 * Hapus satu catatan jurnal.
 *
 * @param {string} noteId
 * @returns {Promise<{ error }>}
 */
export async function deleteJournalNote(noteId) {
  const { error } = await supabase
    .from('journal_notes')
    .delete()
    .eq('id', noteId)

  return { error }
}