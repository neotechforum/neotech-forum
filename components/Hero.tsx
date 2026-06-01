'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import CountdownTimer from './CountdownTimer'

const BlockchainNetwork = dynamic(() => import('./BlockchainNetwork'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-bg" />,
})

export default function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-bg">
      {/* Three.js background */}
      <BlockchainNetwork />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)',
          zIndex: 1,
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, #080808)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto gap-8 pt-24">
        {/* Hotel badge */}
        <div className="flex items-center gap-2 glass-card rounded-full px-4 py-2 text-xs text-white/60">
          <MapPin size={12} className="text-gold" />
          {t.hero.badge}
        </div>

        {/* Main headline */}
        <div className="flex flex-col gap-3">
          <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white leading-none">
            {t.hero.title}
          </h1>
          <p className="font-heading text-2xl sm:text-3xl md:text-4xl font-light text-gold tracking-tight">
            {t.hero.location}
          </p>
        </div>

        {/* Subline */}
        <p className="text-white/60 text-lg sm:text-xl max-w-2xl leading-relaxed">
          {t.hero.subtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/reserver"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-bg font-semibold px-8 py-4 rounded text-sm transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.3)]"
          >
            {t.hero.ctaPrimary}
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/programme"
            className="inline-flex items-center gap-2 border border-white/20 hover:border-gold/40 text-white/80 hover:text-gold font-medium px-8 py-4 rounded text-sm transition-all"
          >
            {t.hero.ctaSecondary}
          </Link>
        </div>

        {/* Countdown */}
        <CountdownTimer />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-gold/60" />
      </div>
    </section>
  )
}
