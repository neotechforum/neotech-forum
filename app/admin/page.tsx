'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Submission } from '@/lib/store'

const GOLD = '#C9A84C'

export default function AdminDashboard() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Submission | null>(null)

  useEffect(() => {
    fetch('/api/admin/submissions')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setSubmissions)
      .catch(() => router.push('/admin/login'))
      .finally(() => setLoading(false))
  }, [router])

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const badge = (type: string) => ({
    background: type === 'precommande' ? 'rgba(201,168,76,0.15)' : 'rgba(0,229,255,0.1)',
    color: type === 'precommande' ? GOLD : '#00E5FF',
    border: `1px solid ${type === 'precommande' ? 'rgba(201,168,76,0.3)' : 'rgba(0,229,255,0.25)'}`,
    borderRadius: '4px', padding: '2px 10px',
    fontFamily: 'sans-serif', fontSize: '.68rem', letterSpacing: '.08em', textTransform: 'uppercase' as const,
  })

  return (
    <div style={{ minHeight: '100vh', background: '#020B18', color: '#fff', fontFamily: 'sans-serif' }}>

      {/* Header */}
      <div style={{ background: 'rgba(8,14,28,0.95)', borderBottom: '1px solid rgba(201,168,76,0.15)', padding: '1.2rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '.6rem', letterSpacing: '.3em', color: GOLD, textTransform: 'uppercase' }}>NeoTech Forum</span>
          <h1 style={{ margin: '2px 0 0', fontSize: '1.1rem', fontWeight: 600 }}>Administration</h1>
        </div>
        <button onClick={logout} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', borderRadius: '4px', padding: '.45rem 1.2rem', cursor: 'pointer', fontSize: '.8rem' }}>
          Déconnexion
        </button>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '1.2rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Total soumissions', value: submissions.length },
            { label: 'Précommandes', value: submissions.filter(s => s.type === 'precommande').length },
            { label: 'Contacts', value: submissions.filter(s => s.type === 'contact').length },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'rgba(8,14,28,0.8)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '6px', padding: '1.2rem 1.8rem', minWidth: '150px' }}>
              <p style={{ margin: '0 0 .3rem', fontSize: '2rem', fontWeight: 700, color: GOLD }}>{stat.value}</p>
              <p style={{ margin: 0, fontSize: '.72rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '.08em', textTransform: 'uppercase' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Chargement...</p>
        ) : submissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '.5rem' }}>Aucune soumission pour l'instant</p>
            <p style={{ fontSize: '.85rem' }}>Les formulaires remplis apparaîtront ici en temps réel.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {submissions.map(s => (
              <div
                key={s.id}
                onClick={() => setSelected(selected?.id === s.id ? null : s)}
                style={{
                  background: 'rgba(8,14,28,0.8)', border: `1px solid ${selected?.id === s.id ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: '6px', padding: '1.2rem 1.5rem', cursor: 'pointer',
                  transition: 'border-color .2s',
                }}
              >
                {/* Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={badge(s.type)}>{s.type === 'precommande' ? 'Précommande' : 'Contact'}</span>
                  <span style={{ fontWeight: 600, fontSize: '.95rem' }}>
                    {s.type === 'precommande'
                      ? `${s.data.prenom} ${s.data.nom}`
                      : s.data.nom}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '.85rem' }}>{s.data.email}</span>
                  {s.data.entreprise && <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '.82rem' }}>· {s.data.entreprise}</span>}
                  {s.type === 'precommande' && s.data.pass && (
                    <span style={{ color: GOLD, fontSize: '.78rem', marginLeft: 'auto' }}>{s.data.pass}</span>
                  )}
                  {s.type === 'contact' && s.data.objet && (
                    <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '.78rem', marginLeft: 'auto' }}>{s.data.objet}</span>
                  )}
                  <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: '.72rem' }}>
                    {new Date(s.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Detail expanded */}
                {selected?.id === s.id && (
                  <div style={{ marginTop: '1.2rem', paddingTop: '1.2rem', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '.8rem' }}>
                    {Object.entries(s.data).filter(([, v]) => v).map(([k, v]) => (
                      <div key={k}>
                        <p style={{ margin: '0 0 .2rem', fontSize: '.62rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{k}</p>
                        <p style={{ margin: 0, fontSize: '.88rem', color: 'rgba(255,255,255,0.8)', wordBreak: 'break-word' }}>{v}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal overlay when selected */}
      {selected && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: -1 }}
          onClick={() => setSelected(null)}
        />
      )}
    </div>
  )
}
