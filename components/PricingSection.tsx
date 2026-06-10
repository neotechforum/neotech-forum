'use client'
import Link from 'next/link'
import { Check, Star } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import AnimatedSection from './AnimatedSection'
import { cn } from '@/lib/utils'

export default function PricingSection() {
  const { t } = useLanguage()

  return (
    <section className="px-6 pb-20">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.pricing.tiers.map((tier, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div
                className={cn(
                  'relative rounded-2xl p-7 flex flex-col h-full transition-all duration-300',
                  'hover:-translate-y-2',
                  tier.recommended
                    ? 'bg-[#0f0f0f] border border-gold/40 shadow-[0_0_60px_rgba(201,168,76,0.12)] hover:shadow-[0_0_80px_rgba(201,168,76,0.2)]'
                    : 'glass-card hover:border-gold/25 hover:shadow-[0_0_40px_rgba(201,168,76,0.06)]'
                )}
              >
                {tier.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1.5 bg-gold text-bg text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(201,168,76,0.5)]">
                      <Star size={11} fill="#080808" />
                      Recommandé
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-heading text-xl font-semibold text-white mb-4">{tier.name}</h3>
                  <div className="flex items-end gap-1">
                    <span className="font-heading text-5xl font-bold text-white">{tier.price}</span>
                    <div className="mb-2 flex flex-col">
                      <span className="text-gold font-semibold text-lg">{tier.currency}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <ul className="flex flex-col gap-3 mb-8">
                    {tier.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <Check size={15} className="text-gold mt-0.5 flex-shrink-0" />
                        <span className="text-white/60 text-sm leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/contact"
                  className={cn(
                    'text-center text-sm font-semibold px-6 py-3.5 rounded transition-all',
                    tier.recommended
                      ? 'bg-gold hover:bg-gold-light text-bg hover:shadow-[0_0_20px_rgba(201,168,76,0.4)]'
                      : 'border border-white/15 text-white/70 hover:border-gold/40 hover:text-gold'
                  )}
                >
                  Précommander ma place
                </Link>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection>
          <div className="text-center mt-10 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-gold/70 text-xs font-medium uppercase tracking-widest">
              <span className="inline-block w-2 h-2 rounded-full bg-gold/60 animate-pulse" />
              Billetterie officielle bientôt disponible
            </div>
            <p className="text-white/35 text-sm">
              Contactez-nous dès maintenant pour réserver votre place en avant-première.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
