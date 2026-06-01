'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'

const EVENT_DATE = new Date('2026-09-19T14:00:00+02:00')

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function getTimeLeft() {
  const diff = EVENT_DATE.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { days, hours, minutes, seconds }
}

export default function CountdownTimer() {
  const { t } = useLanguage()
  const [time, setTime] = useState(getTimeLeft)

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  const units = [
    { value: time.days, label: t.hero.countdown.days },
    { value: time.hours, label: t.hero.countdown.hours },
    { value: time.minutes, label: t.hero.countdown.minutes },
    { value: time.seconds, label: t.hero.countdown.seconds },
  ]

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-white/40 text-xs tracking-widest uppercase">{t.hero.countdown.title}</p>
      <div className="flex gap-3">
        {units.map((unit, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="glass-card rounded-lg px-4 py-3 min-w-[64px] text-center">
              <span className="font-heading text-2xl font-semibold text-gold tabular-nums">
                {pad(unit.value)}
              </span>
            </div>
            <span className="mt-1.5 text-white/35 text-[10px] uppercase tracking-widest">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
