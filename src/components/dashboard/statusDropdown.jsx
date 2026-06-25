'use client'

import { useState, useRef, useEffect } from 'react'
import { BOOK_STATUS, STATUS_LABEL } from '@/src/lib/userBooks'

const FLOW_OPTIONS = {
  [BOOK_STATUS.WANT_TO_READ]: [BOOK_STATUS.CURRENT_READING, BOOK_STATUS.FINISHED],
  [BOOK_STATUS.CURRENT_READING]: [BOOK_STATUS.WANT_TO_READ, BOOK_STATUS.FINISHED],
  [BOOK_STATUS.FINISHED]: [BOOK_STATUS.WANT_TO_READ, BOOK_STATUS.CURRENT_READING],
}

/**
 * StatusDropdown
 * --------------
 * Label status (mis. "To Read") yang berfungsi sebagai dropdown.
 * Klik untuk membuka opsi pindah status lain + hapus dari rak.
 *
 * props:
 * - status: status saat ini (salah satu dari BOOK_STATUS)
 * - onChangeStatus: (newStatus) => void
 * - onRemove: () => void
 * - busy: boolean, disable interaksi saat sedang menyimpan
 */
export default function StatusDropdown({ status, onChangeStatus, onRemove, busy }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const otherStatuses = FLOW_OPTIONS[status] || []

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        disabled={busy}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        className="flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
      >
        {busy ? 'Menyimpan...' : STATUS_LABEL[status] || status}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-10 top-full left-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 text-left"
        >
          {otherStatuses.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setOpen(false)
                onChangeStatus?.(s)
              }}
              className="w-full text-left px-3.5 py-2 text-[12.5px] text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Pindah ke {STATUS_LABEL[s]}
            </button>
          ))}
          <div className="my-1 border-t border-gray-100" />
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onRemove?.()
            }}
            className="w-full text-left px-3.5 py-2 text-[12.5px] text-red-600 hover:bg-red-50 transition-colors"
          >
            Hapus dari rak
          </button>
        </div>
      )}
    </div>
  )
}