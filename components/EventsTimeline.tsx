'use client'
import { useLanguage } from '@/context/LanguageContext'
import AnimatedSection from './AnimatedSection'
import { cn } from '@/lib/utils'

export default function EventsTimeline() {
  const { t } = useLanguage()

  return (
    <section className="section-padding px-6 bg-[#060606]">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <p className="text-gold text-xs tracking-widest uppercase mb-4">Roadmap 2026–2027</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
              {t.events.title}
            </h2>
            <p className="text-white/40 text-base max-w-xl mx-auto">{t.events.subtitle}</p>
          </div>
        </AnimatedSection>

        {/* Desktop: horizontal timeline */}
        <div className="hidden md:block relative">
          {/* Line */}
          <div className="absolute top-10 left-0 right-0 h-px bg-gold/15" />

          <div className="grid grid-cols-5 gap-4">
            {t.events.items.map((ev, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className="relative flex flex-col items-center text-center pt-0">
                  {/* Dot */}
                  <div
                    className={cn(
                      'relative z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center mb-6',
                      ev.highlighted
                        ? 'border-gold bg-gold shadow-[0_0_20px_rgba(201,168,76,0.5)]'
                        : 'border-white/20 bg-bg'
                    )}
                  >
                    {ev.highlighted && (
                      <div className="w-1.5 h-1.5 rounded-full bg-bg" />
                    )}
                  </div>

                  <div
                    className={cn(
                      'glass-card rounded-xl p-5 w-full transition-all hover:border-gold/30',
                      ev.highlighted && 'border-gold/40 shadow-[0_0_30px_rgba(201,168,76,0.08)]'
                    )}
                  >
                    {ev.highlighted && (
                      <div className="inline-block bg-gold text-bg text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-widest mb-3">
                        {t.events.upcoming}
                      </div>
                    )}
                    <div className="text-3xl mb-2">{ev.flag}</div>
                    <h3 className={cn('font-heading font-semibold text-base mb-1', ev.highlighted ? 'text-gold' : 'text-white')}>
                      {ev.city}
                    </h3>
                    <p className="text-white/40 text-xs mb-2">{ev.country}</p>
                    <p className="text-white/60 text-sm font-medium">{ev.date}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* Mobile: vertical list */}
        <div className="md:hidden flex flex-col gap-4">
          {t.events.items.map((ev, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <div
                className={cn(
                  'glass-card rounded-xl p-5 flex items-center gap-4',
                  ev.highlighted && 'border-gold/40 shadow-[0_0_30px_rgba(201,168,76,0.08)]'
                )}
              >
                <div className="text-3xl">{ev.flag}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className={cn('font-heading font-semibold text-base', ev.highlighted ? 'text-gold' : 'text-white')}>
                      {ev.city}
                    </h3>
                    {ev.highlighted && (
                      <span className="bg-gold text-bg text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-widest">
                        Next
                      </span>
                    )}
                  </div>
                  <p className="text-white/40 text-xs">{ev.country}</p>
                </div>
                <p className="text-white/60 text-sm font-medium whitespace-nowrap">{ev.date}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
