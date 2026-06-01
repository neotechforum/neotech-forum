'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '@/context/LanguageContext'
import PricingSection from '@/components/PricingSection'
import ReservationForm from '@/components/ReservationForm'

gsap.registerPlugin(ScrollTrigger)

const GOLD  = '#C9A84C'
const DARK  = '#020B18'
const NAVY  = '#080E1C'
const NAVY2 = '#0B1525'

export default function ReserverPage() {
  const { t, lang } = useLanguage()

  const labelRef = useRef<HTMLSpanElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subRef   = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: 0.15 })
        .from(labelRef.current, { opacity: 0, y: 14, duration: 0.5, ease: 'power2.out' })
        .from(titleRef.current, { opacity: 0, y: 44, duration: 0.75, ease: 'power3.out' }, '-=0.2')
        .from(subRef.current,   { opacity: 0, y: 22, duration: 0.5,  ease: 'power2.out' }, '-=0.3')

      gsap.from('#pricing-section', {
        opacity: 0, y: 30, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '#pricing-section', start: 'top 80%' },
      })
      gsap.from('#form-section', {
        opacity: 0, y: 30, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '#form-section', start: 'top 80%' },
      })
    })
    return () => ctx.revert()
  }, [])

  const label: React.CSSProperties = {
    display: 'block', fontFamily: 'var(--font-body,Inter)',
    fontSize: '.68rem', letterSpacing: '.3em', color: GOLD,
    textTransform: 'uppercase',
  }

  return (
    <div style={{ color: '#fff', background: DARK, minHeight: '100vh' }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', paddingTop: 'clamp(8rem,13vh,10rem)', paddingBottom: 'clamp(4rem,7vh,5.5rem)', textAlign: 'center' }}>

        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 90% 60% at 50% -5%, rgba(201,168,76,.06) 0%, transparent 68%)' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(0,170,255,.04) 1px, transparent 1px)',
          backgroundSize: '38px 38px' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
          background: `linear-gradient(to right, transparent, ${GOLD}22, transparent)` }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px', margin: '0 auto', padding: '0 2rem' }}>
          <span ref={labelRef} style={{ ...label, marginBottom: '1.4rem' }}>Inscription</span>
          <h1 ref={titleRef} style={{ fontFamily: 'var(--font-heading,"Space Grotesk")', fontSize: 'clamp(2.8rem,6vw,5rem)', fontWeight: 300, lineHeight: .95, letterSpacing: '-.03em', margin: '0 0 1.4rem' }}>
            {t.pricing.title}
          </h1>
          <p ref={subRef} style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(.9rem,1.4vw,1rem)', color: 'rgba(255,255,255,.4)', lineHeight: 1.72 }}>
            {t.pricing.subtitle}
          </p>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────────────── */}
      <section id="pricing-section" style={{ background: NAVY2, paddingTop: 'clamp(3rem,5vh,4rem)', paddingBottom: 'clamp(3rem,5vh,4rem)' }}>
        <PricingSection />
      </section>

      {/* ── Divider ────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: 'clamp(3rem,5vh,4.5rem) 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ flex: 1, height: '1px', background: `${GOLD}18` }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '.62rem', letterSpacing: '.22em', color: 'rgba(255,255,255,.25)', textTransform: 'uppercase' }}>
            {lang === 'fr' ? 'Votre inscription' : 'Your registration'}
          </span>
          <div style={{ flex: 1, height: '1px', background: `${GOLD}18` }} />
        </div>
      </div>

      {/* ── Form ───────────────────────────────────────────────────── */}
      <section id="form-section" style={{ background: NAVY, paddingBottom: 'clamp(5rem,9vh,7rem)' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 clamp(1.5rem,4vw,2rem)' }}>
          <ReservationForm />
        </div>
      </section>
    </div>
  )
}
