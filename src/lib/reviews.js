import { supabase } from './supabase'

export async function getBookReviews(bookId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles(username)')
    .eq('book_id', bookId)
    .order('created_at', { ascending: false })

  return { data: data || [], error }
}

export async function upsertReview({ bookId, userId, rating, reviewText }) {
  const { data, error } = await supabase
    .from('reviews')
    .upsert(
      { book_id: bookId, user_id: userId, rating, review_text: reviewText || '' },
      { onConflict: 'user_id,book_id' }
    )
    .select()
    .single()

  return { data, error }
}

export async function getMyReview(bookId, userId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('book_id', bookId)
    .eq('user_id', userId)
    .maybeSingle()

  return { data, error }
}