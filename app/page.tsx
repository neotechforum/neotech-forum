'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GlobeSection from './components/GlobeSection'

gsap.registerPlugin(ScrollTrigger)

const GOLD  = '#C9A84C'
const NAVY  = '#080E1C'
const NAVY2 = '#0B1525'
const DARK  = '#020B18'
const CYAN  = '#00E5FF'

const P = {
  hero:  'https://www.image2url.com/r2/default/videos/1780221443690-60f34b51-14f2-4b38-a5f8-b024606ed61c.mp4',
  event: '/event.jpg',
  conf:  'https://picsum.photos/seed/gva-conf/1920/1080',
  sp1:   'https://laval-virtual.com/wp-content/uploads/2024/03/Maxime-VIDAL-1.png',
  sp2:   '/jonathan-oks.jpg',
  sp3:   'https://media.licdn.com/dms/image/v2/D4E22AQHHhYeeNDA9Ow/feedshare-shrink_800/B4EZ1E7wHrIgAc-/0/1774978008276?e=2147483647&v=beta&t=TU6xTl5viTbT9lORuUvpbePMDV04XQYM6a3KIy_3bmQ',
}

const PROG = [
  {
    num: '01', time: '14:00', tag: 'Accueil',
    title: 'Accueil &\nNetworking',
    desc: "Café, rencontres et premières connexions dans un cadre d'exception. L'opportunité idéale pour créer les liens qui comptent avant même la première conférence.",
    img: '/prog-accueil.jpg',
    accent: CYAN,
  },
  {
    num: '02', time: '14:30', tag: 'Conférence',
    title: 'Blockchain :\nActifs & Régulation',
    desc: "Actifs numériques, DeFi et cadre réglementaire suisse. Juristes, régulateurs et entrepreneurs décryptent les opportunités concrètes de la finance décentralisée en Europe.",
    img: '/prog-blockchain.jpg',
    accent: GOLD,
  },
  {
    num: '03', time: '16:00', tag: 'Conférence & Table Ronde',
    title: 'IA :\nStratégie & Applications',
    desc: "Comment l'IA redéfinit les modèles d'entreprise, la gestion de risque et la prise de décision. Suivi d'une table ronde avec les intervenants et les participants.",
    img: '/prog-ia.jpg',
    accent: CYAN,
  },
  {
    num: '04', time: '18:00', tag: 'Cocktail VIP',
    title: 'Glow Bar\nPrivatisé',
    desc: "Cocktail VIP dans un cadre exclusif au Glow Bar privatisé pour l'occasion. Networking premium, échanges informels et premières rencontres stratégiques.",
    img: '/prog-cocktail.jpg',
    accent: GOLD,
  },
  {
    num: '05', time: '20:00', tag: 'Dîner Exclusif',
    title: 'Dîner avec\nles Intervenants',
    desc: "En petit comité, autour d'une table avec les intervenants du forum. Un moment rare pour approfondir les échanges et nouer des relations durables.",
    img: '/prog-diner.jpg',
    accent: GOLD,
  },
]

function Particles({ style }: { style?: React.CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')!
    const resize = () => {
      c.width  = c.parentElement?.clientWidth  ?? innerWidth
      c.height = c.parentElement?.clientHeight ?? innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    /* coordonnées souris dans le repère du canvas */
    let mx = -9999, my = -9999
    const onMove = (e: MouseEvent) => {
      const r = c.getBoundingClientRect()
      mx = e.clientX - r.left
      my = e.clientY - r.top
    }
    window.addEventListener('mousemove', onMove)

    type N = { x: number; y: number; vx: number; vy: number }
    const nodes: N[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * c.width,  y: Math.random() * c.height,
      vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
    }))

    const ATTRACT_R = 170   // rayon d'attraction souris
    const ATTRACT_F = 0.0007 // force très douce
    const MAX_SPD   = 0.68
    const GLOW_R    = 95    // rayon du halo lumineux

    let raf: number
    const tick = () => {
      ctx.clearRect(0, 0, c.width, c.height)

      nodes.forEach(n => {
        /* attraction douce vers la souris */
        const ddx = mx - n.x, ddy = my - n.y
        const dm  = Math.sqrt(ddx * ddx + ddy * ddy)
        if (dm < ATTRACT_R && dm > 0) {
          const f = (1 - dm / ATTRACT_R) * ATTRACT_F
          n.vx += ddx * f
          n.vy += ddy * f
        }
        /* limite de vitesse */
        const spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy)
        if (spd > MAX_SPD) { n.vx *= MAX_SPD / spd; n.vy *= MAX_SPD / spd }

        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > c.width)  n.vx *= -1
        if (n.y < 0 || n.y > c.height) n.vy *= -1
      })

      /* segments de connexion */
      for (let i = 0; i < nodes.length; i++)
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < 140) {
            ctx.strokeStyle = `rgba(0,170,255,${(1 - d / 140) * .14})`
            ctx.lineWidth   = .9
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }

      /* points avec halo souris */
      nodes.forEach(n => {
        const ddx = mx - n.x, ddy = my - n.y
        const dm  = Math.sqrt(ddx * ddx + ddy * ddy)
        const t   = Math.max(0, 1 - dm / GLOW_R) /* 0→1 selon proximité */

        if (t > 0) {
          /* halo doux */
          ctx.beginPath()
          ctx.arc(n.x, n.y, (2.2 + t * 3) * 2.6, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(0,200,255,${t * .13})`
          ctx.fill()
        }
        /* point */
        ctx.beginPath()
        ctx.arc(n.x, n.y, 2.2 + t * 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,170,255,${.45 + t * .5})`
        ctx.fill()
      })

      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', ...style }} />
}

export default function HomePage() {
  /* hero */
  const heroPhoto  = useRef<HTMLDivElement>(null)
  const heroLabel  = useRef<HTMLSpanElement>(null)
  const heroLine1  = useRef<HTMLSpanElement>(null)
  const heroLine2  = useRef<HTMLSpanElement>(null)
  const heroDesc   = useRef<HTMLParagraphElement>(null)
  const heroCta    = useRef<HTMLDivElement>(null)
  const heroScroll = useRef<HTMLDivElement>(null)

  /* event */
  const evtImg      = useRef<HTMLDivElement>(null)
  const evtImgInner = useRef<HTMLDivElement>(null)
  const evtLabel    = useRef<HTMLSpanElement>(null)
  const evtTitle    = useRef<HTMLHeadingElement>(null)
  const evtDesc     = useRef<HTMLParagraphElement>(null)
  const evtStats    = useRef<HTMLDivElement>(null)

  /* programme */
  const progBgRefs      = useRef<(HTMLDivElement | null)[]>([])
  const progContentRefs = useRef<(HTMLDivElement | null)[]>([])
  const progNumRefs     = useRef<(HTMLDivElement | null)[]>([])
  const progTimeRefs    = useRef<(HTMLSpanElement | null)[]>([])
  const progTickRefs    = useRef<(HTMLDivElement | null)[]>([])
  const progFillRef     = useRef<HTMLDivElement>(null)

  /* speakers */
  const spkSection  = useRef<HTMLElement>(null)
  const spkLabel    = useRef<HTMLSpanElement>(null)
  const spkTitle    = useRef<HTMLHeadingElement>(null)
  const spkCards    = useRef<HTMLDivElement>(null)
  const spkCardRefs = useRef<(HTMLDivElement | null)[]>([])
  const spkDotRefs  = useRef<(HTMLDivElement | null)[]>([])


  /* cta */
  const ctaSection = useRef<HTMLElement>(null)
  const ctaLabel   = useRef<HTMLSpanElement>(null)
  const ctaTitle1  = useRef<HTMLHeadingElement>(null)
  const ctaTitle2  = useRef<HTMLHeadingElement>(null)
  const ctaDesc    = useRef<HTMLParagraphElement>(null)
  const ctaButtons = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    const gctx = gsap.context(() => {

      /* ── HERO ──────────────────────────────────────────────────────── */
      gsap.fromTo(heroPhoto.current,
        { scale: 1.10 },
        { scale: 1.03, duration: 14, ease: 'none' }
      )
      gsap.timeline({ delay: 0.45 })
        .from(heroLabel.current, { opacity: 0, y: 18, duration: 0.6, ease: 'power3.out' })
        .from([heroLine1.current, heroLine2.current],
          { yPercent: 110, stagger: 0.13, duration: 1.0, ease: 'power4.out' }, '-=0.28')
        .from(heroDesc.current, { opacity: 0, y: 26, duration: 0.58, ease: 'power2.out' }, '-=0.38')
        .from(Array.from(heroCta.current?.children ?? []),
          { opacity: 0, y: 18, stagger: 0.1, duration: 0.48, ease: 'power2.out' }, '-=0.32')
        .from(heroScroll.current, { opacity: 0, duration: 0.5 }, '-=0.1')

      gsap.to(heroPhoto.current, {
        yPercent: 18, ease: 'none',
        scrollTrigger: {
          trigger: '#s-hero', start: 'top top', end: 'bottom top', scrub: true,
        },
      })

      /* ── EVENT ─────────────────────────────────────────────────────── */
      gsap.fromTo(evtImg.current,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 1.3, ease: 'power4.inOut',
          scrollTrigger: { trigger: evtImg.current, start: 'top 80%' } }
      )
      gsap.fromTo(evtImgInner.current,
        { scale: 1.14 },
        { scale: 1.0, duration: 1.6, ease: 'power3.out',
          scrollTrigger: { trigger: evtImg.current, start: 'top 80%' } }
      )
      gsap.timeline({ scrollTrigger: { trigger: evtLabel.current, start: 'top 82%' } })
        .from(evtLabel.current, { opacity: 0, x: 55, duration: 0.55, ease: 'power3.out' })
        .from(evtTitle.current, { opacity: 0, x: 65, duration: 0.72, ease: 'power3.out' }, '-=0.3')
        .from(evtDesc.current,  { opacity: 0, x: 45, duration: 0.58, ease: 'power2.out' }, '-=0.35')
        .from(Array.from(evtStats.current?.children ?? []),
          { opacity: 0, y: 32, stagger: 0.12, duration: 0.5, ease: 'back.out(1.6)' }, '-=0.25')

      /* ── SPEAKERS ──────────────────────────────────────────────────── */
      const cards = spkCardRefs.current.filter(Boolean) as HTMLDivElement[]
      const dots  = spkDotRefs.current.filter(Boolean) as HTMLDivElement[]

      if (!isMobile) {
        /* Desktop : scroll-driven card deck */
        const exitX = -(window.innerWidth + 300)

        gsap.set(cards[0], { x: 0,  y: 0,  rotation: 0, scale: 1,    zIndex: 4 })
        gsap.set(cards[1], { x: 28, y: 16, rotation: 3, scale: 0.94, zIndex: 3 })
        gsap.set(cards[2], { x: 56, y: 32, rotation: 6, scale: 0.88, zIndex: 2 })
        gsap.set(cards[3], { x: 84, y: 48, rotation: 9, scale: 0.82, zIndex: 1 })

        const spkTl = gsap.timeline({
          scrollTrigger: { trigger: '#s-speakers', start: 'top top', end: 'bottom bottom', scrub: 1.4 },
        })
        spkTl.to({}, { duration: 0.5 })
        spkTl
          .to(cards[0], { x: exitX, rotation: -16, opacity: 0, duration: 0.65, ease: 'power2.in' })
          .to(cards[1], { x: 0, y: 0, rotation: 0, scale: 1, zIndex: 4, duration: 0.65, ease: 'power3.out' }, '<')
          .to(cards[2], { x: 28, y: 16, rotation: 3, scale: 0.94, zIndex: 3, duration: 0.65, ease: 'power3.out' }, '<')
          .to(cards[3], { x: 56, y: 32, rotation: 6, scale: 0.88, zIndex: 2, duration: 0.65, ease: 'power3.out' }, '<')
          .to(dots[0], { width: '8px', backgroundColor: 'rgba(255,255,255,.18)', duration: 0.3 }, '<')
          .to(dots[1], { width: '28px', backgroundColor: GOLD, duration: 0.3 }, '<')
        spkTl.to({}, { duration: 0.5 })
        spkTl
          .to(cards[1], { x: exitX, rotation: -16, opacity: 0, duration: 0.65, ease: 'power2.in' })
          .to(cards[2], { x: 0, y: 0, rotation: 0, scale: 1, zIndex: 4, duration: 0.65, ease: 'power3.out' }, '<')
          .to(cards[3], { x: 28, y: 16, rotation: 3, scale: 0.94, zIndex: 3, duration: 0.65, ease: 'power3.out' }, '<')
          .to(dots[1], { width: '8px', backgroundColor: 'rgba(255,255,255,.18)', duration: 0.3 }, '<')
          .to(dots[2], { width: '28px', backgroundColor: GOLD, duration: 0.3 }, '<')
        spkTl.to({}, { duration: 0.5 })
        spkTl
          .to(cards[2], { x: exitX, rotation: -16, opacity: 0, duration: 0.65, ease: 'power2.in' })
          .to(cards[3], { x: 0, y: 0, rotation: 0, scale: 1, zIndex: 4, duration: 0.65, ease: 'power3.out' }, '<')
          .to(dots[2], { width: '8px', backgroundColor: 'rgba(255,255,255,.18)', duration: 0.3 }, '<')
          .to(dots[3], { width: '28px', backgroundColor: GOLD, duration: 0.3 }, '<')
        spkTl.to({}, { duration: 0.5 })
      } else {
        /* Mobile : état initial — carte 0 visible, les autres masquées */
        gsap.set(cards[0], { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, zIndex: 4 })
        cards.slice(1).forEach(c => gsap.set(c, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 0, zIndex: 1 }))
      }

      gsap.timeline({ scrollTrigger: { trigger: '#s-speakers', start: 'top 85%' } })
        .from(spkLabel.current, { opacity: 0, x: -40, duration: 0.55, ease: 'power3.out' })
        .from(spkTitle.current, { opacity: 0, x: -50, duration: 0.65, ease: 'power3.out' }, '-=0.28')

      /* ── PROGRAMME — pinned scroll ─────────────────────────────────── */
      const bgs   = progBgRefs.current.filter(Boolean) as HTMLDivElement[]
      const cons  = progContentRefs.current.filter(Boolean) as HTMLDivElement[]
      const nums  = progNumRefs.current.filter(Boolean) as HTMLDivElement[]
      const times = progTimeRefs.current.filter(Boolean) as HTMLSpanElement[]
      const ticks = progTickRefs.current.filter(Boolean) as HTMLDivElement[]

      const progTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#s-programme',
          pin: true,
          invalidateOnRefresh: true,
          start: 'top top',
          end: `+=${PROG.length * innerHeight * 1.35}`,
          scrub: 1.8,
        },
      })

      progTl.to({}, { duration: 1.7 })

      for (let i = 0; i < PROG.length - 1; i++) {
        progTl
          .to(cons[i], { x: -60, opacity: 0, duration: 0.55, ease: 'power2.in' })
          .to(nums[i], { opacity: 0, duration: 0.4, ease: 'power2.in' }, '<')
          .to(bgs[i],  { opacity: 0, duration: 0.55, ease: 'power2.in' }, '<')
          .to(times[i], { color: 'rgba(255,255,255,.2)', duration: 0.3 }, '<')
          .to(ticks[i], { width: '8px', backgroundColor: 'rgba(255,255,255,.12)', duration: 0.3 }, '<')
        progTl
          .to(bgs[i+1], { opacity: 1, duration: 0.65, ease: 'power2.out' })
          .to(nums[i+1], { opacity: 1, duration: 0.45, ease: 'power2.out' }, '<+=0.15')
          .fromTo(cons[i+1],
            { x: 70, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.65, ease: 'power3.out' }, '<+=0.1')
          .to(times[i+1], { color: PROG[i+1].accent, duration: 0.35 }, '<')
          .to(ticks[i+1], { width: '26px', backgroundColor: PROG[i+1].accent, duration: 0.35 }, '<')
        progTl.to({}, { duration: 1.7 })
      }

      const totalDur = progTl.duration()
      progTl.to(
        progFillRef.current,
        { clipPath: 'inset(0 0 0% 0)', ease: 'none', duration: totalDur },
        0
      )

      /* ── CTA ───────────────────────────────────────────────────────── */
      gsap.timeline({ scrollTrigger: { trigger: ctaSection.current, start: 'top 72%' } })
        .from(ctaLabel.current, { opacity: 0, y: 16, duration: 0.5 })
        .from(ctaTitle1.current, { opacity: 0, y: 52, scale: 0.93, duration: 0.75, ease: 'power3.out' }, '-=0.2')
        .from(ctaTitle2.current, { opacity: 0, y: 52, scale: 0.93, duration: 0.75, ease: 'power3.out' }, '-=0.6')
        .from(ctaDesc.current, { opacity: 0, y: 22, duration: 0.55 }, '-=0.3')
        .from(Array.from(ctaButtons.current?.children ?? []),
          { opacity: 0, y: 18, stagger: 0.12, duration: 0.48 }, '-=0.25')
    })

    /* ── Mobile swipe sur les cartes intervenants ──────────────────── */
    let touchStartX = 0
    let currentCard = 0

    const onTouchStart = (e: TouchEvent) => { touchStartX = e.touches[0].clientX }

    const onTouchEnd = (e: TouchEvent) => {
      const diff = touchStartX - e.changedTouches[0].clientX
      if (Math.abs(diff) < 50) return

      const cards = spkCardRefs.current.filter(Boolean) as HTMLDivElement[]
      const dots  = spkDotRefs.current.filter(Boolean) as HTMLDivElement[]
      const next  = diff > 0
        ? Math.min(currentCard + 1, cards.length - 1)
        : Math.max(currentCard - 1, 0)

      if (next === currentCard) return

      const exitX = diff > 0 ? -(window.innerWidth + 100) : (window.innerWidth + 100)
      const enterX = diff > 0 ? (window.innerWidth + 100) : -(window.innerWidth + 100)

      gsap.to(cards[currentCard], { x: exitX, opacity: 0, duration: 0.35, ease: 'power2.in' })
      gsap.fromTo(cards[next],
        { x: enterX, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.38, ease: 'power3.out', delay: 0.1 }
      )
      dots.forEach((d, i) => gsap.to(d, {
        width: i === next ? '28px' : '8px',
        backgroundColor: i === next ? GOLD : 'rgba(255,255,255,.18)',
        duration: 0.25,
      }))

      currentCard = next
    }

    if (isMobile && spkSection.current) {
      spkSection.current.addEventListener('touchstart', onTouchStart, { passive: true })
      spkSection.current.addEventListener('touchend', onTouchEnd, { passive: true })
    }

    return () => {
      gctx.revert()
      if (isMobile && spkSection.current) {
        spkSection.current.removeEventListener('touchstart', onTouchStart)
        spkSection.current.removeEventListener('touchend', onTouchEnd)
      }
    }
  }, [])

  /* shared styles */
  const labelSty: React.CSSProperties = {
    display: 'block', fontFamily: 'var(--font-body,Inter)',
    fontSize: '.68rem', letterSpacing: '.3em', color: GOLD, textTransform: 'uppercase',
  }
  const btnSolid: React.CSSProperties = {
    display: 'inline-block', padding: '.9rem 2.4rem', background: GOLD,
    color: '#080808', fontFamily: 'var(--font-heading,"Space Grotesk")',
    fontWeight: 600, fontSize: '.88rem', letterSpacing: '.07em',
    borderRadius: '2px', textDecoration: 'none',
  }
  const btnGhost: React.CSSProperties = {
    display: 'inline-block', padding: '.9rem 2.4rem', background: 'transparent',
    color: '#fff', border: '1px solid rgba(255,255,255,.22)',
    fontFamily: 'var(--font-heading,"Space Grotesk")',
    fontWeight: 400, fontSize: '.88rem', letterSpacing: '.07em',
    borderRadius: '2px', textDecoration: 'none',
  }

  return (
    <div style={{ color: '#fff' }}>

      {/* ══ HERO ═════════════════════════════════════════════════════════ */}
      <section id="s-hero" style={{ position: 'relative', height: '100svh', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', background: NAVY }}>

        <div ref={heroPhoto} style={{ position: 'absolute', inset: '-20% 0', zIndex: 0, transformOrigin: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }} />
        </div>
        {/* Overlay bleu marine basse opacité */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(4,12,40,.55)' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to top,rgba(8,14,28,.97) 0%,rgba(8,14,28,.35) 48%,rgba(8,14,28,.08) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(100deg,rgba(8,14,28,.65) 0%,transparent 55%)' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          <Particles />
        </div>

        <div style={{ position: 'relative', zIndex: 3, padding: '0 clamp(2rem,7vw,8rem) clamp(8vh,12vh,14vh)' }}>
          <span ref={heroLabel} style={{ ...labelSty, marginBottom: '1.6rem' }}>Genève · Septembre 2026</span>
          <h1 style={{ margin: '0 0 2.2rem', lineHeight: 1 }}>
            <span style={{ overflow: 'hidden', display: 'block' }}>
              <span ref={heroLine1} style={{
                display: 'block',
                fontFamily: 'var(--font-tech,"Orbitron")',
                fontSize: 'clamp(3.2rem,8.5vw,8rem)',
                fontWeight: 800,
                letterSpacing: '-.01em',
                color: '#fff',
                lineHeight: .95,
                textTransform: 'uppercase',
              }}>NeoTech</span>
            </span>
            <span style={{ overflow: 'hidden', display: 'block' }}>
              <span ref={heroLine2} style={{
                display: 'block',
                fontFamily: 'var(--font-heading,"Space Grotesk")',
                fontSize: 'clamp(1.4rem,3.2vw,3rem)',
                fontWeight: 300,
                letterSpacing: '.75em',
                color: GOLD,
                textTransform: 'uppercase',
                marginTop: '.5rem',
                paddingLeft: '.1em',
              }}>Forum</span>
            </span>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 1.6rem' }}>
            <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.5 0C3.46 0 1 2.46 1 5.5c0 4.12 5.5 10.5 5.5 10.5S12 9.62 12 5.5C12 2.46 9.54 0 6.5 0zm0 7.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" fill="#C9A84C"/>
            </svg>
            <span style={{ fontFamily: 'var(--font-body,Inter)', fontSize: 'clamp(.72rem,1.1vw,.85rem)', color: GOLD, letterSpacing: '.06em' }}>
              Hôtel Président Wilson, Genève
            </span>
          </div>
          <p ref={heroDesc} style={{ fontFamily: 'var(--font-body,Inter)', fontSize: 'clamp(.9rem,1.5vw,1.08rem)', fontWeight: 300, color: 'rgba(255,255,255,.52)', maxWidth: '40ch', lineHeight: 1.78, margin: '0 0 2.8rem' }}>
            Places limitées. Un événement exclusif pour dirigeants, experts et investisseurs autour des technologies qui redéfinissent la finance, l'entreprise et la stratégie.
          </p>
          <div ref={heroCta} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/contact" style={btnSolid}>Précommander ma place →</Link>
            <Link href="/programme" style={btnGhost}>Voir le programme</Link>
          </div>
        </div>

        <div ref={heroScroll} style={{ position: 'absolute', bottom: '2.8rem', right: 'clamp(2rem,5vw,5rem)', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '.55rem', letterSpacing: '.22em', color: 'rgba(255,255,255,.25)', textTransform: 'uppercase', writingMode: 'vertical-rl' }}>Scroll</span>
          <div style={{ width: '1px', height: '52px', background: `linear-gradient(to bottom,${GOLD}55,transparent)` }} />
        </div>
      </section>

      {/* ══ L'ÉVÉNEMENT ══════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', background: NAVY2, overflow: 'hidden', padding: 'clamp(6rem,12vh,14rem) 0' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(0,170,255,.046) 1px,transparent 1px)', backgroundSize: '38px 38px' }} />
        <div style={{ position: 'absolute', left: 0, top: '8%', bottom: '8%', width: '2px', background: `linear-gradient(to bottom,transparent,${GOLD}38,transparent)` }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(2rem,6vw,7rem)', display: 'flex', flexWrap: 'wrap', gap: 'clamp(3.5rem,7vw,9rem)', alignItems: 'center' }}>

          <div ref={evtImg} style={{ flex: '0 0 min(100%,460px)', position: 'relative', borderRadius: '3px', overflow: 'hidden', aspectRatio: '3/4' }}>
            <div ref={evtImgInner} style={{ position: 'absolute', inset: '-6%', transformOrigin: 'center' }}>
              <Image src={P.event} alt="L'Événement" fill style={{ objectFit: 'cover', objectPosition: 'center 30%' }} quality={85} />
            </div>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(8,14,28,.55) 0%,transparent 50%)', zIndex: 1 }} />
            <div style={{ position: 'absolute', top: '1.2rem', left: '1.2rem', width: '34px', height: '34px', borderTop: `1px solid ${GOLD}`, borderLeft: `1px solid ${GOLD}`, zIndex: 2 }} />
            <div style={{ position: 'absolute', bottom: '1.2rem', right: '1.2rem', width: '34px', height: '34px', borderBottom: `1px solid ${GOLD}`, borderRight: `1px solid ${GOLD}`, zIndex: 2 }} />
            <div style={{ position: 'absolute', right: 0, top: '15%', bottom: '15%', width: '2px', background: `linear-gradient(to bottom,transparent,${GOLD},transparent)`, zIndex: 2 }} />
          </div>

          <div style={{ flex: '1 1 320px' }}>
            <span ref={evtLabel} style={{ ...labelSty, marginBottom: '1.5rem' }}>L'Événement</span>
            <h2 ref={evtTitle} style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.7rem,3.3vw,2.9rem)', fontWeight: 300, lineHeight: 1.18, letterSpacing: '-.02em', margin: '0 0 1.8rem' }}>
              Là où les décideurs suisses rencontrent les technologies qui transforment les marchés.
            </h2>
            <p ref={evtDesc} style={{ fontFamily: 'var(--font-body)', fontSize: '.95rem', color: 'rgba(255,255,255,.46)', lineHeight: 1.82, margin: '0 0 3rem' }}>
              Organisé par EagleChain SA dans l'un des lieux les plus prestigieux de Genève : l'Hôtel Président Wilson, en bord de lac. Un format dense et sans remplissage, au cœur de la capitale de l'innovation financière en Europe.
            </p>
            <div ref={evtStats} style={{ display: 'flex', gap: '2.8rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: '2.2rem' }}>
              {[['5★','Premium'],['3','Experts'],['½','Journée']].map(([n,l]) => (
                <div key={l}>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.4rem,4.5vw,3.2rem)', fontWeight: 300, color: GOLD, margin: '0 0 .3rem', lineHeight: 1 }}>{n}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '.65rem', color: 'rgba(255,255,255,.28)', letterSpacing: '.16em', textTransform: 'uppercase', margin: 0 }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ LES INTERVENANTS — card deck ════════════════════════════════ */}
      <section id="s-speakers" ref={spkSection} style={{ position: 'relative', height: '480vh', background: NAVY }}>
        <div className="spk-sticky" style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden' }}>

        {/* Particules flottantes — même effet que le hero */}
        <Particles />

        {/* Subtle grid + glow */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(0,170,255,.038) 1px,transparent 1px)', backgroundSize: '38px 38px' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 65% 55% at 62% 50%,rgba(201,168,76,.055) 0%,transparent 68%)' }} />

        <style>{`
          @media (max-width: 768px) {
            #s-speakers { height: auto !important; overflow: hidden !important; }
            .spk-sticky { position: relative !important; overflow: hidden !important; height: auto !important; padding-bottom: 3rem; }
            .spk-layout {
              flex-direction: column !important;
              justify-content: flex-start !important;
              align-items: flex-start !important;
              padding-top: 6rem !important;
              gap: 2rem !important;
            }
            .spk-left { max-width: 100% !important; width: 100% !important; }
            .spk-left h2 { font-size: 1.4rem !important; margin-bottom: 1rem !important; }
            .spk-cards {
              width: min(260px, 74vw) !important;
              height: 360px !important;
              align-self: center !important;
              margin: 0 auto !important;
            }
            .spk-swipe-hint { display: flex !important; }
          }
          .spk-swipe-hint { display: none; }
        `}</style>

        {/* Layout: left text / right stack */}
        <div className="spk-layout" style={{
          position: 'relative', zIndex: 2, height: '100%',
          display: 'flex', alignItems: 'center',
          maxWidth: '1280px', margin: '0 auto',
          padding: '0 clamp(2rem,6vw,7rem)',
          gap: 'clamp(3rem,8vw,10rem)',
        }}>

          {/* ─ Left panel ─ */}
          <div className="spk-left" style={{ flex: '0 0 auto', maxWidth: '340px' }}>
            <span ref={spkLabel} style={{ ...labelSty, marginBottom: '1.5rem', display: 'block' }}>Les Intervenants</span>
            <h2 ref={spkTitle} style={{
              fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem,2.8vw,2.3rem)',
              fontWeight: 300, lineHeight: 1.18, letterSpacing: '-.02em', margin: '0 0 3rem',
            }}>
              Des experts qui façonnent les marchés de demain.
            </h2>

            {/* Progress dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3.5rem' }}>
              {([0, 1, 2, 3] as const).map(i => (
                <div key={i} ref={el => { spkDotRefs.current[i] = el }} style={{
                  height: '6px', borderRadius: '3px',
                  width: i === 0 ? '28px' : '8px',
                  background: i === 0 ? GOLD : 'rgba(255,255,255,.18)',
                }} />
              ))}
            </div>

            {/* Scroll hint — desktop */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '24px', height: '1px', background: `${GOLD}44` }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '.58rem', letterSpacing: '.22em', color: 'rgba(255,255,255,.22)', textTransform: 'uppercase' }}>
                Défiler pour découvrir
              </span>
            </div>

            {/* Swipe hint — mobile uniquement */}
            <div className="spk-swipe-hint" style={{ alignItems: 'center', gap: '10px', marginTop: '.5rem' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '.58rem', letterSpacing: '.22em', color: 'rgba(255,255,255,.22)', textTransform: 'uppercase' }}>
                ← Swiper pour naviguer →
              </span>
            </div>
          </div>

          {/* ─ Right: card stack ─ */}
          <div ref={spkCards} className="spk-cards" style={{
            position: 'relative',
            width: 'clamp(300px,30vw,380px)',
            height: 'clamp(430px,56vh,560px)',
            flexShrink: 0,
          }}>

            {/* Card 3 — back (mystery) */}
            <div ref={el => { spkCardRefs.current[3] = el }} style={{
              position: 'absolute', inset: 0, borderRadius: '16px', overflow: 'hidden',
              border: `1px solid rgba(201,168,76,.18)`,
              background: DARK,
              boxShadow: '0 18px 55px rgba(0,0,0,.55)',
            }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '7rem', color: `${GOLD}18`, fontFamily: 'var(--font-heading)', fontWeight: 700 }}>?</span>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top,rgba(2,8,16,.96) 0%,transparent 65%)', padding: '2.4rem 2rem 2rem' }}>
                <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.1rem', margin: '0 0 .35rem', filter: 'blur(5px)', color: 'rgba(255,255,255,.35)', userSelect: 'none' }}>??? ???</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '.72rem', color: GOLD, letterSpacing: '.06em', margin: '0 0 .65rem' }}>Révélé le 15 septembre 2026</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '.8rem', color: 'rgba(255,255,255,.38)', lineHeight: 1.65, margin: 0 }}>Une surprise de taille. Réservez votre place pour ne pas le manquer.</p>
              </div>
            </div>

            {/* Card 2 — Joseph Mont */}
            <div ref={el => { spkCardRefs.current[2] = el }} style={{
              position: 'absolute', inset: 0, borderRadius: '16px', overflow: 'hidden',
              border: `1px solid rgba(201,168,76,.28)`,
              boxShadow: '0 22px 65px rgba(0,0,0,.6)',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={P.sp3} alt="Joseph Mont" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(2,8,16,.96) 0%,rgba(2,8,16,.18) 55%,transparent 100%)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2.4rem 2rem 2rem' }}>
                <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.1rem', margin: '0 0 .35rem' }}>Joseph Mont</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '.72rem', color: GOLD, letterSpacing: '.06em', margin: '0 0 .65rem' }}>Fondateur de PIVOIA</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '.8rem', color: 'rgba(255,255,255,.5)', lineHeight: 1.65, margin: 0 }}>Ingénieur &amp; expert d'implémentation IA au sein des entreprises.</p>
              </div>
            </div>

            {/* Card 1 — Jonathan Oks */}
            <div ref={el => { spkCardRefs.current[1] = el }} style={{
              position: 'absolute', inset: 0, borderRadius: '16px', overflow: 'hidden',
              border: `1px solid rgba(201,168,76,.28)`,
              boxShadow: '0 22px 65px rgba(0,0,0,.6)',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={P.sp2} alt="Jonathan Oks" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(2,8,16,.96) 0%,rgba(2,8,16,.18) 55%,transparent 100%)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2.4rem 2rem 2rem' }}>
                <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.1rem', margin: '0 0 .35rem' }}>Jonathan Oks</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '.72rem', color: GOLD, letterSpacing: '.06em', margin: '0 0 .65rem' }}>Expert Blockchain &amp; Marchés Numériques</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '.8rem', color: 'rgba(255,255,255,.5)', lineHeight: 1.65, margin: 0 }}>Spécialiste des actifs numériques et des protocoles DeFi en Europe.</p>
              </div>
            </div>

            {/* Card 0 — Maxime Vidal (front) */}
            <div ref={el => { spkCardRefs.current[0] = el }} style={{
              position: 'absolute', inset: 0, borderRadius: '16px', overflow: 'hidden',
              border: `1px solid rgba(201,168,76,.42)`,
              boxShadow: `0 32px 80px rgba(0,0,0,.65), 0 0 0 0.5px rgba(201,168,76,.12)`,
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={P.sp1} alt="Maxime Vidal" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(2,8,16,.96) 0%,rgba(2,8,16,.18) 55%,transparent 100%)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2.4rem 2rem 2rem' }}>
                <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.1rem', margin: '0 0 .35rem' }}>Maxime Vidal</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '.72rem', color: GOLD, letterSpacing: '.06em', margin: '0 0 .65rem' }}>Speaker VivaTech</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '.8rem', color: 'rgba(255,255,255,.5)', lineHeight: 1.65, margin: 0 }}>Expert IA générative &amp; stratégie data. Intervenant VivaTech 2025 &amp; 2026.</p>
              </div>
            </div>

          </div>
        </div>
        </div>{/* /sticky */}
      </section>

      {/* ══ GLOBE ════════════════════════════════════════════════════════ */}
      <GlobeSection />

      {/* ══ PROGRAMME — pinned ════════════════════════════════════════════ */}
      <section id="s-programme" style={{ position: 'relative', height: '100svh', overflow: 'hidden', background: DARK }}>

        {/* Background images — stacked */}
        {PROG.map((step, i) => (
          <div
            key={i}
            ref={el => { progBgRefs.current[i] = el }}
            style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: i === 0 ? 1 : 0 }}
          >
            <Image src={step.img} alt={step.title.replace('\n', ' ')} fill style={{ objectFit: 'cover', objectPosition: 'center' }} quality={85} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg,rgba(2,11,24,.96) 0%,rgba(2,11,24,.72) 48%,rgba(2,11,24,.25) 100%)' }} />
          </div>
        ))}

        {/* Decorative large step number — right background */}
        {PROG.map((step, i) => (
          <div
            key={i}
            ref={el => { progNumRefs.current[i] = el }}
            style={{
              position: 'absolute', right: 'clamp(2rem,6vw,7rem)', bottom: 'clamp(3rem,8vh,9rem)',
              zIndex: 1, opacity: i === 0 ? 1 : 0, pointerEvents: 'none',
              fontFamily: 'var(--font-heading,"Space Grotesk")',
              fontSize: 'clamp(10rem,22vw,22rem)', fontWeight: 700,
              lineHeight: 1, letterSpacing: '-.05em',
              color: 'transparent',
              WebkitTextStroke: `1px rgba(255,255,255,.055)`,
              userSelect: 'none',
            }}
          >
            {step.num}
          </div>
        ))}

        <style>{`
          @media (max-width: 768px) {
            .prog-content {
              justify-content: flex-end !important;
              padding: 0 1.2rem 2.5rem !important;
              max-width: 100% !important;
            }
            .prog-tag {
              position: absolute !important;
              top: 8.5rem !important;
              left: 1.2rem !important;
              margin-bottom: 0 !important;
            }
            .prog-bubble {
              background: rgba(2,11,24,0.80) !important;
              backdrop-filter: blur(14px) !important;
              -webkit-backdrop-filter: blur(14px) !important;
              border: 1px solid rgba(255,255,255,.1) !important;
              border-radius: 10px !important;
              padding: 1.2rem 1.4rem !important;
            }
            .prog-bubble h3 { font-size: 1.45rem !important; margin-bottom: .7rem !important; }
            .prog-bubble p  { font-size: .82rem !important; margin-bottom: .9rem !important; }
            .prog-timebar {
              top: 5.5rem !important;
              transform: none !important;
              right: 1rem !important;
            }
          }
        `}</style>

        {/* Content panels — stacked */}
        {PROG.map((step, i) => (
          <div
            key={i}
            ref={el => { progContentRefs.current[i] = el }}
            className="prog-content"
            style={{
              position: 'absolute', inset: 0, zIndex: 3,
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '0 clamp(2rem,7vw,8rem)',
              maxWidth: '620px',
              opacity: i === 0 ? 1 : 0,
            }}
          >
            {/* Step tag + time */}
            <div className="prog-tag" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '2rem' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '.62rem', letterSpacing: '.28em', color: step.accent, textTransform: 'uppercase' }}>
                {step.tag}
              </span>
              <div style={{ width: '32px', height: '1px', background: `${step.accent}55` }} />
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '.82rem', color: step.accent, letterSpacing: '.12em', fontWeight: 400 }}>
                {step.time}
              </span>
            </div>

            {/* Bubble — title + description + counter */}
            <div className="prog-bubble">
              <h3 style={{ fontFamily: 'var(--font-heading,"Space Grotesk")', fontSize: 'clamp(2rem,4.5vw,4rem)', fontWeight: 300, lineHeight: 1.08, letterSpacing: '-.025em', margin: '0 0 1.8rem', whiteSpace: 'pre-line' }}>
                {step.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-body,Inter)', fontSize: 'clamp(.88rem,1.4vw,1.02rem)', color: 'rgba(255,255,255,.46)', lineHeight: 1.82, margin: '0 0 3rem', maxWidth: '44ch' }}>
                {step.desc}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1rem,1.8vw,1.3rem)', fontWeight: 300, color: step.accent }}>
                  {step.num}
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '.65rem', color: 'rgba(255,255,255,.25)', letterSpacing: '.1em' }}>
                  / 0{PROG.length}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Time progress indicator — right side */}
        <div className="prog-timebar" style={{
          position: 'absolute', right: 'clamp(2rem,4vw,5rem)',
          top: '50%', transform: 'translateY(-50%)',
          zIndex: 10, display: 'flex', alignItems: 'stretch', gap: '14px',
        }}>

          {/* Track + animated fill */}
          <div style={{ position: 'relative', width: '1px', flexShrink: 0 }}>
            {/* Dim track (full height) */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,.09)' }} />
            {/* Fill — clipPath reveal driven by GSAP scrub */}
            <div
              ref={progFillRef}
              style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(to bottom, ${CYAN}cc, ${GOLD}cc)`,
                clipPath: 'inset(0 0 100% 0)',
              }}
            />
          </div>

          {/* Time labels */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {PROG.map((step, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    ref={el => { progTimeRefs.current[i] = el }}
                    style={{
                      fontFamily: 'var(--font-heading,"Space Grotesk")',
                      fontSize: '.7rem', letterSpacing: '.1em', lineHeight: 1,
                      color: i === 0 ? PROG[0].accent : 'rgba(255,255,255,.2)',
                      fontWeight: 400,
                    }}
                  >
                    {step.time}
                  </span>
                  <div
                    ref={el => { progTickRefs.current[i] = el }}
                    style={{
                      height: '1px',
                      width: i === 0 ? '26px' : '8px',
                      backgroundColor: i === 0 ? PROG[0].accent : 'rgba(255,255,255,.12)',
                    }}
                  />
                  <div style={{
                    width: '4px', height: '4px', borderRadius: '50%', flexShrink: 0,
                    background: i === 0 ? PROG[0].accent : 'rgba(255,255,255,.12)',
                  }} />
                </div>
                {i < PROG.length - 1 && <div style={{ height: '30px' }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Top label */}
        <div style={{ position: 'absolute', top: 'clamp(5.5rem,10vh,7rem)', left: 'clamp(2rem,7vw,8rem)', zIndex: 10 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '.62rem', letterSpacing: '.28em', color: 'rgba(255,255,255,.28)', textTransform: 'uppercase' }}>
            Programme
          </span>
        </div>
      </section>

      {/* ══ NEOTECH ACADEMY TEASER ══════════════════════════════════════ */}
      <section style={{ position: 'relative', background: NAVY2, overflow: 'hidden', padding: 'clamp(5.5rem,11vh,10rem) 0' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(0,170,255,.038) 1px,transparent 1px)', backgroundSize: '38px 38px' }} />
        <div style={{ position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px', background: `linear-gradient(to right,transparent,${GOLD}22,transparent)` }} />
        <div style={{ position: 'absolute', bottom: 0, left: '8%', right: '8%', height: '1px', background: `linear-gradient(to right,transparent,${GOLD}22,transparent)` }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(2rem,6vw,7rem)', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'clamp(3rem,7vw,7rem)' }}>

            {/* Left */}
            <div style={{ flex: '1 1 380px', maxWidth: '540px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', padding: '.4rem 1rem', border: `1px solid ${GOLD}33`, borderRadius: '2px' }}>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: GOLD }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '.58rem', letterSpacing: '.28em', color: GOLD, textTransform: 'uppercase' }}>by EagleChain SA</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem,4.5vw,3.8rem)', fontWeight: 300, lineHeight: .96, letterSpacing: '-.03em', margin: '0 0 .25rem' }}>NeoTech</h2>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem,4.5vw,3.8rem)', fontWeight: 300, lineHeight: .96, letterSpacing: '-.03em', color: GOLD, margin: '0 0 2rem' }}>Academy</h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(.88rem,1.4vw,1rem)', color: 'rgba(255,255,255,.42)', lineHeight: 1.82, margin: '0 0 2.6rem', maxWidth: '46ch' }}>
                Formations premium en IA, Blockchain &amp; Transformation digitale. Formats courts et concrets pour dirigeants, cadres et équipes métiers.
              </p>
              <Link href="/academy" style={{ ...btnSolid, display: 'inline-block' }}>Découvrir l'Academy →</Link>
            </div>

            {/* Right — programme pills */}
            <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {[
                { num: '01', title: 'Executive Briefing', sub: 'IA, blockchain & stratégie · format 2h ou demi-journée' },
                { num: '02', title: 'Management Workshops', sub: 'IA opérationnelle & agents IA · demi-journée ou journée' },
                { num: '03', title: 'Sector Programs', sub: 'Banque, logistique, conformité · programmes sur mesure' },
              ].map(p => (
                <div key={p.num} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '1.4rem',
                  padding: '1.4rem 1.8rem',
                  background: 'rgba(8,14,28,.55)',
                  border: '1px solid rgba(201,168,76,.1)',
                  borderRadius: '3px',
                }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem,2.8vw,2rem)', fontWeight: 700, color: `${GOLD}28`, lineHeight: 1, flexShrink: 0 }}>{p.num}</span>
                  <div>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: '.98rem', fontWeight: 400, margin: '0 0 .35rem' }}>{p.title}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '.78rem', color: 'rgba(255,255,255,.32)', margin: 0, lineHeight: 1.65 }}>{p.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════════════════ */}
      <section ref={ctaSection} style={{ position: 'relative', minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', overflow: 'hidden', background: DARK }}>

        <div style={{ position: 'absolute', inset: 0 }}>
          <Particles style={{ opacity: .5 }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 75% 55% at 50% 50%,rgba(0,170,255,.06) 0%,transparent 72%)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '6%', right: '6%', height: '1px', background: `linear-gradient(to right,transparent,${GOLD}18,transparent)`, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px', padding: '0 2rem' }}>
          <span ref={ctaLabel} style={{ ...labelSty, marginBottom: '2.2rem' }}>Places limitées</span>
          <h2 ref={ctaTitle1} style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.8rem,7vw,6rem)', fontWeight: 300, lineHeight: .95, letterSpacing: '-.03em', margin: '0 0 .35rem' }}>
            Votre place.<br />Votre réseau.
          </h2>
          <h2 ref={ctaTitle2} style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.8rem,7vw,6rem)', fontWeight: 300, lineHeight: .95, letterSpacing: '-.03em', color: GOLD, margin: '0 0 2.5rem' }}>
            Votre avenir.
          </h2>
          <p ref={ctaDesc} style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(.9rem,1.4vw,1.05rem)', color: 'rgba(255,255,255,.4)', maxWidth: '38ch', margin: '0 auto 3.2rem', lineHeight: 1.82 }}>
            Places limitées. Un format d'exception pour dirigeants, experts et investisseurs. L'intersection de la finance et de la tech.
          </p>
          <div ref={ctaButtons} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/reserver" style={{ ...btnSolid, padding: '.95rem 2.6rem', fontSize: '.9rem' }}>Réserver ma place →</Link>
            <Link href="/contact" style={{ ...btnGhost, padding: '.95rem 2.6rem', fontSize: '.9rem' }}>Nous contacter</Link>
          </div>
          <p style={{ marginTop: '5rem', fontFamily: 'var(--font-body)', fontSize: '.6rem', color: 'rgba(255,255,255,.14)', letterSpacing: '.18em', textTransform: 'uppercase' }}>
            Organisé par EagleChain SA · Genève 2026
          </p>
        </div>
      </section>

    </div>
  )
}
