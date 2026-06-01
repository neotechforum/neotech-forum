'use client'
import { useEffect, ReactNode } from 'react'
import { LanguageProvider } from '@/context/LanguageContext'

function LenisInit() {
  useEffect(() => {
    let lenis: import('lenis').default | null = null

    async function init() {
      const { default: Lenis } = await import('lenis')
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')

      gsap.registerPlugin(ScrollTrigger)

      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })

      lenis.on('scroll', ScrollTrigger.update)

      gsap.ticker.add((time) => {
        lenis!.raf(time * 1000)
      })

      gsap.ticker.lagSmoothing(0)
    }

    init()

    return () => {
      if (lenis) lenis.destroy()
    }
  }, [])

  return null
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <LenisInit />
      {children}
    </LanguageProvider>
  )
}
