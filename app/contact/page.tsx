'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '@/context/LanguageContext'
import ContactForm from '@/components/ContactForm'

gsap.registerPlugin(ScrollTrigger)

const GOLD  = '#C9A84C'
const DARK  = '#020B18'
const NAVY  = '#080E1C'

export default function ContactPage() {
  const { t } = useLanguage()

  const labelRef = useRef<HTMLSpanElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subRef   = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: 0.15 })
        .from(labelRef.current, { opacity: 0, y: 14, duration: 0.5, ease: 'power2.out' })
        .from(titleRef.current, { opacity: 0, y: 44, duration: 0.75, ease: 'power3.out' }, '-=0.2')
        .from(subRef.current,   { opacity: 0, y: 22, duration: 0.5,  ease: 'power2.out' }, '-=0.3')

      gsap.from('#contact-body', {
        opacity: 0, y: 30, duration: 0.65, ease: 'power2.out',
        scrollTrigger: { trigger: '#contact-body', start: 'top 80%' },
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
          background: 'radial-gradient(ellipse 90% 60% at 50% -5%, rgba(0,170,255,.07) 0%, transparent 68%)' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(0,170,255,.04) 1px, transparent 1px)',
          backgroundSize: '38px 38px' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
          background: `linear-gradient(to right, transparent, ${GOLD}22, transparent)` }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px', margin: '0 auto', padding: '0 2rem' }}>
          <span ref={labelRef} style={{ ...label, marginBottom: '1.4rem' }}>EagleChain SA</span>
          <h1 ref={titleRef} style={{ fontFamily: 'var(--font-heading,"Space Grotesk")', fontSize: 'clamp(2.8rem,6vw,5rem)', fontWeight: 300, lineHeight: .95, letterSpacing: '-.03em', margin: '0 0 1.4rem' }}>
            {t.contact.title}
          </h1>
          <p ref={subRef} style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(.9rem,1.4vw,1rem)', color: 'rgba(255,255,255,.4)', lineHeight: 1.72 }}>
            {t.contact.subtitle}
          </p>
        </div>
      </section>

      {/* ── Form body ──────────────────────────────────────────────── */}
      <section id="contact-body" style={{ background: NAVY, padding: 'clamp(4rem,7vh,6rem) clamp(1.5rem,5vw,2rem)', paddingBottom: 'clamp(6rem,10vh,8rem)' }}>
        <ContactForm />
      </section>
    </div>
  )
}
