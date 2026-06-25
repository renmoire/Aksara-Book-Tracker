'use client'

import { useState } from 'react'

/**
 * StarRating
 * Komponen bintang interaktif untuk beri rating.
 * props:
 * - value: number (1-5), rating yang tersimpan saat ini
 * - onChange: (rating: number) => void
 * - readonly: boolean — kalau true, tidak bisa diklik (untuk tampilkan rating komunitas)
 * - size: 'sm' | 'md' — ukuran bintang
 */
export default function StarRating({ value = 0, onChange, readonly = false, size = 'md' }) {
  const [hovered, setHovered] = useState(0)

  const starSize = size === 'sm' ? 'text-[14px]' : 'text-[20px]'
  const active = hovered || value

  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => !readonly && setHovered(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(n)}
          onMouseEnter={() => !readonly && setHovered(n)}
          className={`${starSize} leading-none transition-colors ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          } ${n <= active ? 'text-orange-500' : 'text-gray-200'}`}
          aria-label={readonly ? undefined : `Beri ${n} bintang`}
        >
          ★
        </button>
      ))}
    </div>
  )
}