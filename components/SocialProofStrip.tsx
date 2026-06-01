'use client'
import { useLanguage } from '@/context/LanguageContext'

export default function SocialProofStrip() {
  const { t } = useLanguage()

  const text = t.social.text

  return (
    <section className="bg-[#0a0a0a] border-y border-gold/10 overflow-hidden py-5">
      <div className="flex whitespace-nowrap animate-marquee gap-0">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="inline-flex items-center gap-8 px-12">
            <span className="text-white/45 text-sm">{text}</span>
            <span className="text-gold/40 text-sm">·</span>
            <span className="text-gold text-sm font-heading font-semibold tracking-widest uppercase">
              EagleChain SA
            </span>
            <span className="text-gold/40 text-sm">·</span>
          </span>
        ))}
      </div>
    </section>
  )
}
