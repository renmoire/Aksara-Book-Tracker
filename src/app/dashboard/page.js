'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push('/login')
      } else {
        setUser(data.user)
      }
    }
    checkUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return <p style={{ padding: '20px' }}>Loading...</p>

  return (
    <div style={{ padding: '40px' }}>
      <h1>Dashboard</h1>
      <p>Halo, {user.email} 👋</p>
      <button onClick={handleLogout} style={{ padding: '8px 16px', marginTop: '12px' }}>
        Logout
      </button>
    </div>
  )
}