'use client'

import Link from 'next/link'
import Image from 'next/image'

const GOLD  = '#C9A84C'
const NAVY  = '#080E1C'
const DARK  = '#020B18'

const PROGRAMS = [
  {
    num: '01',
    title: 'Executive Briefing',
    subtitle: "IA, blockchain et stratégie d'entreprise",
    format: 'Format 2h ou demi-journée pour dirigeants et comités de direction.',
    accent: GOLD,
  },
  {
    num: '02',
    title: 'Management Workshops',
    subtitle: 'IA opérationnelle, automatisation et agents IA',
    format: 'Ateliers pratiques en demi-journée ou journée pour cadres et managers.',
    accent: '#00E5FF',
  },
  {
    num: '03',
    title: 'Sector Programs',
    subtitle: 'Banque, logistique, conformité, traçabilité, data governance',
    format: 'Programmes sur mesure adaptés aux enjeux métiers et sectoriels.',
    accent: GOLD,
  },
]

const WHO = [
  'Dirigeants et comités de direction',
  'Cadres, managers et équipes métiers',
  'Banques, institutions, industrie, logistique',
  'Entreprises en transformation digitale',
]

const OBJECTIVES = [
  "Comprendre les usages concrets de l'IA et de la blockchain",
  'Identifier les opportunités et les risques',
  'Structurer une feuille de route opérationnelle',
  "Sécuriser l'adoption des nouvelles technologies",
]

const inp: React.CSSProperties = {
  background: 'rgba(255,255,255,.04)',
  border: '1px solid rgba(255,255,255,.1)',
  borderRadius: '2px',
  padding: '.85rem 1.1rem',
  color: '#fff',
  fontFamily: 'var(--font-body,Inter)',
  fontSize: '.88rem',
  width: '100%',
  boxSizing: 'border-box' as const,
  outline: 'none',
}

export default function AcademyPage() {
  return (
    <div style={{ background: DARK, color: '#fff' }}>

      <style>{`
        .acad-inp:focus { border-color: rgba(201,168,76,.5) !important; }
        .acad-inp::placeholder { color: rgba(255,255,255,.2); }
        .acad-inp option { background: #080E1C; }
        .acad-card:hover { border-color: rgba(201,168,76,.32) !important; transform: translateY(-2px); }
        .acad-card { transition: border-color .22s, transform .22s; }
        .acad-prog:hover { background: rgba(201,168,76,.04) !important; }
        .acad-prog { transition: background .2s; }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.2rem clamp(2rem,5vw,5rem)',
        borderBottom: '1px solid rgba(255,255,255,.06)',
        backdropFilter: 'blur(20px)',
        background: 'rgba(2,11,24,.88)',
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
          <Image src="/logo.png" alt="NeoTech Forum" width={100} height={50} style={{ objectFit: 'contain' }} />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '.56rem', color: GOLD, margin: 0, letterSpacing: '.22em', textTransform: 'uppercase' }}>← Retour au forum</p>
        </Link>
        <a href="#contact" style={{
          fontFamily: 'var(--font-heading)', fontSize: '.82rem', fontWeight: 600,
          padding: '.65rem 1.8rem', background: GOLD, color: '#080808',
          borderRadius: '2px', textDecoration: 'none', letterSpacing: '.05em',
        }}>
          Demander une formation
        </a>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100svh', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        background: `linear-gradient(145deg,${DARK} 0%,rgba(8,14,28,.98) 100%)`,
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(0,170,255,.038) 1px,transparent 1px)', backgroundSize: '38px 38px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 55% 45% at 50% 55%,rgba(201,168,76,.05) 0%,transparent 68%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px', background: `linear-gradient(to right,transparent,${GOLD}22,transparent)` }} />

        <div style={{
          position: 'relative', zIndex: 2, width: '100%',
          maxWidth: '860px', margin: '0 auto',
          padding: 'clamp(9rem,16vh,13rem) clamp(2rem,6vw,7rem) clamp(6rem,10vh,8rem)',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            marginBottom: '2.2rem', padding: '.45rem 1.1rem',
            border: `1px solid ${GOLD}33`, borderRadius: '2px',
          }}>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: GOLD }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '.6rem', letterSpacing: '.32em', color: GOLD, textTransform: 'uppercase' }}>by EagleChain SA</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 300,
            fontSize: 'clamp(3.2rem,9vw,7.5rem)', lineHeight: .92,
            letterSpacing: '-.03em', margin: '0 0 .25rem',
          }}>NeoTech</h1>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 300,
            fontSize: 'clamp(3.2rem,9vw,7.5rem)', lineHeight: .92,
            letterSpacing: '-.03em', color: GOLD, margin: '0 0 2.8rem',
          }}>Academy</h1>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(.95rem,1.7vw,1.14rem)', fontWeight: 300, color: 'rgba(255,255,255,.55)', maxWidth: '50ch', margin: '0 auto 1.4rem', lineHeight: 1.72 }}>
            Formations premium en IA, Blockchain &amp; Transformation digitale
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(.85rem,1.3vw,.97rem)', color: 'rgba(255,255,255,.3)', maxWidth: '58ch', margin: '0 auto 3.8rem', lineHeight: 1.88 }}>
            Accompagner les dirigeants, cadres et entreprises dans la compréhension, l'adoption et la sécurisation des nouvelles technologies — formats courts, concrets et adaptés aux enjeux métiers.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#contact" style={{
              display: 'inline-block', padding: '.95rem 2.6rem',
              background: GOLD, color: '#080808',
              fontFamily: 'var(--font-heading)', fontWeight: 600,
              fontSize: '.9rem', letterSpacing: '.07em',
              borderRadius: '2px', textDecoration: 'none',
            }}>Demander une formation →</a>
            <a href="#programmes" style={{
              display: 'inline-block', padding: '.95rem 2.6rem',
              background: 'transparent', color: '#fff',
              border: '1px solid rgba(255,255,255,.22)',
              fontFamily: 'var(--font-heading)', fontWeight: 400,
              fontSize: '.9rem', letterSpacing: '.07em',
              borderRadius: '2px', textDecoration: 'none',
            }}>Voir les programmes</a>
          </div>
        </div>
      </section>

      {/* ── PROGRAMMES ───────────────────────────────────────────────── */}
      <section id="programmes" style={{ background: NAVY, padding: 'clamp(5rem,10vh,8rem) 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(2rem,6vw,7rem)' }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '.68rem', letterSpacing: '.3em', color: GOLD, textTransform: 'uppercase', marginBottom: '1.1rem' }}>Notre offre</span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem,3.2vw,2.9rem)', fontWeight: 300, letterSpacing: '-.02em', margin: '0 0 4.5rem', lineHeight: 1.12 }}>
            Notre offre de formation entreprise
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,290px),1fr))', gap: '1.6rem' }}>
            {PROGRAMS.map(p => (
              <div key={p.num} className="acad-card" style={{
                background: 'rgba(8,14,28,.55)', border: '1px solid rgba(201,168,76,.14)',
                borderRadius: '4px', padding: '2.8rem 2.4rem',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(to right,transparent,${p.accent}55,transparent)` }} />
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(4rem,7vw,5.5rem)', fontWeight: 700, color: `${p.accent}18`, lineHeight: 1, margin: '0 0 2rem', letterSpacing: '-.04em' }}>{p.num}</p>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.15rem,2vw,1.55rem)', fontWeight: 400, margin: '0 0 .7rem', letterSpacing: '-.01em' }}>{p.title}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '.74rem', color: p.accent, letterSpacing: '.06em', margin: '0 0 1.3rem' }}>{p.subtitle}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '.88rem', color: 'rgba(255,255,255,.42)', lineHeight: 1.82, margin: 0 }}>{p.format}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POUR QUI + OBJECTIFS ─────────────────────────────────────── */}
      <section style={{ background: DARK, padding: 'clamp(5rem,10vh,8rem) 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(0,170,255,.03) 1px,transparent 1px)', backgroundSize: '38px 38px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(2rem,6vw,7rem)', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap: 'clamp(3.5rem,7vw,7rem)' }}>

            {/* Pour qui */}
            <div>
              <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '.68rem', letterSpacing: '.3em', color: GOLD, textTransform: 'uppercase', marginBottom: '1.1rem' }}>Audience</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem,2.8vw,2.4rem)', fontWeight: 300, letterSpacing: '-.02em', margin: '0 0 2.8rem', lineHeight: 1.15 }}>Pour qui ?</h2>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {WHO.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <span style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      border: `1px solid ${GOLD}44`, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', flexShrink: 0, marginTop: '1px',
                    }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: GOLD, display: 'block' }} />
                    </span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '.92rem', color: 'rgba(255,255,255,.52)', lineHeight: 1.68 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Objectifs */}
            <div>
              <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '.68rem', letterSpacing: '.3em', color: GOLD, textTransform: 'uppercase', marginBottom: '1.1rem' }}>Résultats</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem,2.8vw,2.4rem)', fontWeight: 300, letterSpacing: '-.02em', margin: '0 0 2.8rem', lineHeight: 1.15 }}>Objectifs</h2>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {OBJECTIVES.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <span style={{
                      width: '22px', height: '22px', borderRadius: '3px',
                      border: `1px solid ${GOLD}44`, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', flexShrink: 0, marginTop: '1px',
                    }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '.62rem', color: GOLD, fontWeight: 700, lineHeight: 1 }}>✓</span>
                    </span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '.92rem', color: 'rgba(255,255,255,.52)', lineHeight: 1.68 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FORMULAIRE ───────────────────────────────────────────────── */}
      <section id="contact" style={{ background: NAVY, padding: 'clamp(5rem,10vh,8rem) 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '6%', right: '6%', height: '1px', background: `linear-gradient(to right,transparent,${GOLD}12,transparent)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: '660px', margin: '0 auto', padding: '0 clamp(2rem,6vw,7rem)', position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '.68rem', letterSpacing: '.3em', color: GOLD, textTransform: 'uppercase', marginBottom: '1.1rem' }}>Contact</span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.9rem,3.8vw,3.2rem)', fontWeight: 300, letterSpacing: '-.02em', margin: '0 0 1rem' }}>
            Demander une formation
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '.95rem', color: 'rgba(255,255,255,.36)', lineHeight: 1.82, margin: '0 0 3.5rem' }}>
            Décrivez votre contexte et vos besoins. Notre équipe vous répond sous 48h avec une proposition sur mesure.
          </p>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }} onSubmit={e => e.preventDefault()}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                <label style={{ fontFamily: 'var(--font-body)', fontSize: '.62rem', letterSpacing: '.18em', color: 'rgba(255,255,255,.32)', textTransform: 'uppercase' }}>Nom *</label>
                <input required placeholder="Votre nom" className="acad-inp" style={inp} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                <label style={{ fontFamily: 'var(--font-body)', fontSize: '.62rem', letterSpacing: '.18em', color: 'rgba(255,255,255,.32)', textTransform: 'uppercase' }}>Entreprise *</label>
                <input required placeholder="Nom de l'entreprise" className="acad-inp" style={inp} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '.62rem', letterSpacing: '.18em', color: 'rgba(255,255,255,.32)', textTransform: 'uppercase' }}>Email professionnel *</label>
              <input required type="email" placeholder="votre@email.com" className="acad-inp" style={inp} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '.62rem', letterSpacing: '.18em', color: 'rgba(255,255,255,.32)', textTransform: 'uppercase' }}>Programme d'intérêt</label>
              <select className="acad-inp" style={{ ...inp, appearance: 'none' as const, cursor: 'pointer' }}>
                <option value="">Sélectionner un programme</option>
                <option>01 — Executive Briefing</option>
                <option>02 — Management Workshops</option>
                <option>03 — Sector Programs</option>
                <option>Sur mesure / autre</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '.62rem', letterSpacing: '.18em', color: 'rgba(255,255,255,.32)', textTransform: 'uppercase' }}>Message</label>
              <textarea rows={4} placeholder="Décrivez votre contexte, vos équipes, vos objectifs..." className="acad-inp" style={{ ...inp, resize: 'vertical', minHeight: '110px' }} />
            </div>

            <button type="submit" style={{
              marginTop: '.5rem', padding: '1rem 2.6rem',
              background: GOLD, color: '#080808',
              fontFamily: 'var(--font-heading)', fontWeight: 600,
              fontSize: '.9rem', letterSpacing: '.07em',
              borderRadius: '2px', border: 'none', cursor: 'pointer',
            }}>
              Envoyer la demande →
            </button>
          </form>

          <p style={{ marginTop: '2rem', fontFamily: 'var(--font-body)', fontSize: '.6rem', color: 'rgba(255,255,255,.16)', letterSpacing: '.14em', textTransform: 'uppercase' }}>
            Réponse garantie sous 48h — EagleChain SA, Genève
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <div style={{
        background: DARK, borderTop: '1px solid rgba(255,255,255,.06)',
        padding: '1.8rem clamp(2rem,6vw,7rem)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
      }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '.6rem', color: 'rgba(255,255,255,.18)', letterSpacing: '.14em', textTransform: 'uppercase' }}>
          NeoTech Academy · EagleChain SA · Genève 2026
        </span>
        <Link href="/" style={{ fontFamily: 'var(--font-body)', fontSize: '.6rem', color: GOLD, letterSpacing: '.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
          ← Retour au forum
        </Link>
      </div>
    </div>
  )
}
