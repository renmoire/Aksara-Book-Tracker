'use client'

import AppShell from '../layout/appShell'

export default function CommunityPage() {
  return (
    <AppShell>
      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <p className="text-[13px] text-gray-400 mb-1">Terhubung dengan pembaca lain</p>
          <h1 className="text-3xl font-serif text-gray-900">Community</h1>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 py-24 border border-dashed border-gray-200 rounded-2xl bg-white/50 text-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="text-gray-300" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="7" r="4" />
            <circle cx="17" cy="9" r="3" />
            <path d="M2 21c0-4 3-6 7-6s7 2 7 6" />
            <path d="M17 12c2 0 5 1.5 5 5" />
          </svg>
          <p className="text-[14px] font-medium text-gray-500">Community segera hadir</p>
          <p className="text-[12.5px] text-gray-400 max-w-xs">Fitur ini sedang dalam pengembangan. Nantikan pembaruan selanjutnya!</p>
          <span className="mt-2 px-3 py-1 bg-orange-50 text-orange-500 text-[11.5px] font-semibold rounded-full border border-orange-100">
            Segera Hadir
          </span>
        </div>
      </div>
    </AppShell>
  )
}