'use client'

import StarRating from './starRating'

export default function CommunityReviews({ reviews = [] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-[13px] text-gray-400 text-center py-6 border border-dashed border-gray-200 rounded-2xl">
        Belum ada review dari komunitas.
      </p>
    )
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <span className="text-[28px] font-semibold text-gray-900 leading-none">
          {avgRating.toFixed(1)}
        </span>
        <div className="flex flex-col gap-1">
          <StarRating value={Math.round(avgRating)} readonly size="sm" />
          <span className="text-[11.5px] text-gray-400">{reviews.length} ulasan</span>
        </div>
      </div>

      {reviews.map((review) => {
        const name = review.profiles?.username || 'Pembaca'
        const initials = name.slice(0, 2).toUpperCase()
        const date = new Date(review.created_at).toLocaleDateString('id-ID', {
          day: 'numeric', month: 'long', year: 'numeric',
        })

        return (
          <div key={review.id} className="flex flex-col gap-2 pt-4 border-t border-gray-100 first:border-0 first:pt-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-[11px] font-semibold shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-gray-900 truncate">{name}</p>
                <p className="text-[11px] text-gray-400">{date}</p>
              </div>
              <StarRating value={review.rating} readonly size="sm" />
            </div>
            {review.review_text && (
              <p className="text-[13px] text-gray-600 leading-relaxed ml-[36px]">{review.review_text}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}