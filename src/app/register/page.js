'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setErrorMsg(error.message)
    } else {
      setSuccessMsg('Berhasil daftar! Silakan cek email untuk verifikasi, lalu login.')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '20px' }}>
      <h1>Daftar</h1>
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '12px' }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '4px',
              border: '1px solid #888',
              borderRadius: '4px',
              backgroundColor: '#fff',
              color: '#000',
            }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '4px',
              border: '1px solid #888',
              borderRadius: '4px',
              backgroundColor: '#fff',
              color: '#000',
            }}
          />
        </div>
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
        <button type="submit" disabled={loading} style={{
          width: '100%',
          padding: '10px',
          marginTop: '8px',
          backgroundColor: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>
          {loading ? 'Loading...' : 'Daftar'}
        </button>
      </form>
      <p style={{ marginTop: '12px' }}>
        Udah punya akun? <a href="/login">Login disini</a>
      </p>
    </div>
  )
}