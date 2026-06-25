'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/src/lib/supabase'
import Sidebar from './sidebar'

export default function AppShell({ children }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (!authUser) {
          router.push('/login')
          return
        }

        // maybeSingle() tidak error kalau row tidak ada (hindari 406)
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle()

        setUser({
          id: authUser.id,
          email: authUser.email,
          name:
            profile?.name ||
            profile?.full_name ||
            profile?.username ||
            authUser.email?.split('@')[0] ||
            'Pembaca',
          booksThisYear: profile?.books_this_year ?? profile?.booksthisyear ?? 0,
        })
      } catch (err) {
        console.error('AppShell init error:', err)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f5f4f0] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-[#1a2332] text-white font-semibold flex items-center justify-center text-sm">A</span>
          <p className="text-[13px] text-gray-400">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#f5f4f0]">
      <Sidebar user={user} />
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}