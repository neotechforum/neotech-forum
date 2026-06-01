'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CalendarDays, MapPin } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import ProgrammeTimeline from '@/components/ProgrammeTimeline'

gsap.registerPlugin(ScrollTrigger)

const GOLD  = '#C9A84C'
const DARK  = '#020B18'
const NAVY  = '#080E1C'
const NAVY2 = '#0B1525'

export default function ProgrammePage() {
  const { t } = useLanguage()

  const labelRef = useRef<HTMLSpanElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subRef   = useRef<HTMLParagraphElement>(null)
  const chipsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: 0.15 })
        .from(labelRef.current, { opacity: 0, y: 14, duration: 0.5, ease: 'power2.out' })
        .from(titleRef.current, { opacity: 0, y: 44, duration: 0.75, ease: 'power3.out' }, '-=0.2')
        .from(subRef.current,   { opacity: 0, y: 22, duration: 0.5,  ease: 'power2.out' }, '-=0.35')
        .from(chipsRef.current, { opacity: 0, y: 16, duration: 0.45, ease: 'power2.out' }, '-=0.25')

      gsap.timeline({
        scrollTrigger: { trigger: '#prog-timeline', start: 'top 80%' },
      }).from('#prog-timeline', { opacity: 0, y: 30, duration: 0.6, ease: 'power2.out' })

      gsap.timeline({
        scrollTrigger: { trigger: '#prog-cta', start: 'top 82%' },
      }).from('#prog-cta', { opacity: 0, y: 28, scale: 0.97, duration: 0.55, ease: 'power2.out' })
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
          background: 'radial-gradient(ellipse 90% 60% at 50% -5%, rgba(0,170,255,.07) 0%, transparent 68%)' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(0,170,255,.04) 1px, transparent 1px)',
          backgroundSize: '38px 38px' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
          background: `linear-gradient(to right, transparent, ${GOLD}22, transparent)` }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px', margin: '0 auto', padding: '0 2rem' }}>
          <span ref={labelRef} style={{ ...label, marginBottom: '1.4rem' }}>
            NeoTech Forum · Genève 2026
          </span>
          <h1 ref={titleRef} style={{ fontFamily: 'var(--font-heading,"Space Grotesk")', fontSize: 'clamp(2.8rem,6vw,5rem)', fontWeight: 300, lineHeight: .95, letterSpacing: '-.03em', margin: '0 0 1.4rem' }}>
            {t.programme.title}
          </h1>
          <p ref={subRef} style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(.9rem,1.4vw,1rem)', color: 'rgba(255,255,255,.4)', lineHeight: 1.72, margin: '0 0 2.4rem' }}>
            {t.programme.subtitle}
          </p>

          <div ref={chipsRef} style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(8,14,28,.84)', border: '1px solid rgba(0,170,255,.14)', borderRadius: '3px', padding: '.8rem 1.8rem', backdropFilter: 'blur(20px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-body)', fontSize: '.78rem', color: 'rgba(255,255,255,.55)' }}>
              <CalendarDays size={13} style={{ color: GOLD, flexShrink: 0 }} />
              {t.programme.date}
            </div>
            <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,.1)', margin: '0 1.4rem' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-body)', fontSize: '.78rem', color: 'rgba(255,255,255,.55)' }}>
              <MapPin size={13} style={{ color: GOLD, flexShrink: 0 }} />
              Hôtel Métropole Genève
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ───────────────────────────────────────────────── */}
      <section id="prog-timeline" style={{ background: NAVY2, padding: 'clamp(4rem,7vh,6rem) 0' }}>

        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 clamp(1.5rem,5vw,3rem)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3.5rem' }}>
            <div style={{ flex: 1, height: '1px', background: `${GOLD}18` }} />
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: `${GOLD}55` }} />
            <div style={{ flex: 1, height: '1px', background: `${GOLD}18` }} />
          </div>
          <ProgrammeTimeline />
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(4rem,7vh,6rem) 2rem', textAlign: 'center', background: NAVY }}>
        <div id="prog-cta" style={{ maxWidth: '480px', margin: '0 auto', background: 'rgba(8,14,28,.84)', border: '1px solid rgba(0,170,255,.14)', borderRadius: '4px', padding: 'clamp(2rem,4vw,3rem) 2.5rem', backdropFilter: 'blur(22px)' }}>
          <span style={{ ...label, marginBottom: '1.2rem' }}>Places limitées</span>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '.92rem', color: 'rgba(255,255,255,.4)', marginBottom: '2rem', lineHeight: 1.72 }}>
            Rejoignez 200 décideurs pour cette demi-journée d'exception à Genève.
          </p>
          <Link href="/reserver" style={{ display: 'inline-block', padding: '.9rem 2.4rem', background: GOLD, color: '#080808', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '.88rem', letterSpacing: '.07em', borderRadius: '2px', textDecoration: 'none' }}>
            {t.nav.reserveCta}
          </Link>
        </div>
      </section>
    </div>
  )
}
