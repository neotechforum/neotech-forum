'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password }),
    })

    if (res.ok) {
      router.push('/admin')
    } else {
      setError('Identifiants incorrects')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#020B18', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'rgba(8,14,28,0.9)', border: '1px solid rgba(201,168,76,0.2)',
        borderRadius: '8px', padding: '3rem', width: '100%', maxWidth: '380px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ fontFamily: 'sans-serif', fontSize: '.65rem', letterSpacing: '.3em', color: '#C9A84C', textTransform: 'uppercase', margin: '0 0 .5rem' }}>NeoTech Forum</p>
          <h1 style={{ fontFamily: 'sans-serif', fontSize: '1.4rem', fontWeight: 600, color: '#fff', margin: 0 }}>Administration</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'sans-serif', fontSize: '.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: '.5rem' }}>
              Identifiant
            </label>
            <input
              type="text" value={id} onChange={e => setId(e.target.value)} required
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '.75rem 1rem', color: '#fff', fontFamily: 'sans-serif', fontSize: '.9rem', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: 'sans-serif', fontSize: '.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: '.5rem' }}>
              Mot de passe
            </label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '.75rem 1rem', color: '#fff', fontFamily: 'sans-serif', fontSize: '.9rem', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          {error && (
            <p style={{ fontFamily: 'sans-serif', fontSize: '.82rem', color: '#ff6b6b', margin: 0 }}>{error}</p>
          )}

          <button type="submit" disabled={loading} style={{
            marginTop: '.5rem', padding: '.9rem', background: '#C9A84C', color: '#080808',
            fontFamily: 'sans-serif', fontWeight: 700, fontSize: '.9rem',
            border: 'none', borderRadius: '4px', cursor: 'pointer', letterSpacing: '.05em',
          }}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
