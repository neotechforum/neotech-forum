'use client'
import { useEffect, useRef } from 'react'
import {
  Coffee, Mic, Brain, Link, Users, Layout, BookOpen, Star, CheckCircle,
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

const icons: Record<string, React.ElementType> = {
  coffee: Coffee,
  mic: Mic,
  brain: Brain,
  link: Link,
  users: Users,
  layout: Layout,
  book: BookOpen,
  star: Star,
  check: CheckCircle,
}

export default function ProgrammeTimeline() {
  const { t } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function init() {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const items = containerRef.current?.querySelectorAll('.timeline-item')
      if (!items) return

      gsap.fromTo(
        items,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )
    }
    init()
  }, [])

  return (
    <div ref={containerRef} className="relative max-w-3xl mx-auto">
      {/* Vertical gold line */}
      <div className="absolute left-[88px] top-0 bottom-0 w-px bg-gold/15 hidden md:block" />

      <div className="flex flex-col gap-0">
        {t.programme.sessions.map((session, i) => {
          const Icon = icons[session.icon] || Star
          const isHighlight = session.icon === 'star'

          return (
            <div
              key={i}
              className={`timeline-item opacity-0 flex gap-0 md:gap-8 items-start py-5 border-b border-white/5 last:border-0 ${isHighlight ? 'bg-gold/[0.03] -mx-4 px-4 rounded-xl' : ''}`}
            >
              {/* Time */}
              <div className="w-[80px] flex-shrink-0 pt-1 hidden md:block">
                <span className="font-heading text-sm font-semibold text-gold/70 tabular-nums">
                  {session.time}
                </span>
              </div>

              {/* Icon dot */}
              <div className="relative z-10 flex-shrink-0 hidden md:flex items-center justify-center w-9 h-9 rounded-full border border-gold/25 bg-bg">
                <Icon size={15} className="text-gold" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-0.5 md:hidden">
                  <span className="font-heading text-sm font-semibold text-gold/70">{session.time}</span>
                  <Icon size={14} className="text-gold/60" />
                </div>
                <h3 className={`font-heading font-semibold text-base md:text-lg mb-1 ${isHighlight ? 'text-gold' : 'text-white'}`}>
                  {session.title}
                </h3>
                {session.desc && (
                  <p className="text-white/45 text-sm leading-relaxed">{session.desc}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
