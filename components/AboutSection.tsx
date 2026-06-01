'use client'
import { Shield, Lock, Database, Zap } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import AnimatedSection from './AnimatedSection'

const icons = {
  shield: Shield,
  lock: Lock,
  database: Database,
  zap: Zap,
}

export default function AboutSection() {
  const { t } = useLanguage()

  return (
    <section className="section-padding px-6 bg-bg">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
              {t.about.title}
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">{t.about.subtitle}</p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {t.about.challenges.map((challenge, i) => {
            const Icon = icons[challenge.icon as keyof typeof icons] || Shield
            return (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="glass-card rounded-xl p-6 h-full flex flex-col gap-4 hover:border-gold/30 transition-colors group">
                  <div className="w-11 h-11 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold/15 transition-colors">
                    <Icon size={20} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-white text-base mb-2">
                      {challenge.title}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed">{challenge.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            )
          })}
        </div>

        {/* Pull quote */}
        <AnimatedSection>
          <div className="relative max-w-3xl mx-auto text-center">
            <div className="text-gold/20 font-heading text-8xl absolute -top-8 left-0 leading-none select-none">
              &ldquo;
            </div>
            <blockquote className="relative z-10 font-heading text-xl md:text-2xl font-light text-white/80 leading-relaxed italic px-8">
              {t.about.quote}
            </blockquote>
            <div className="mt-6 h-px w-16 bg-gold/40 mx-auto" />
            <p className="mt-3 text-gold text-sm font-semibold tracking-widest uppercase">
              NeoTech Forum
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
