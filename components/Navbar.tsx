'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const { lang, setLang, t } = useLanguage()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { href: '/', label: t.nav.home },
    { href: '/programme', label: t.nav.programme },
    { href: '/reserver', label: t.nav.reserve },
    { href: '/contact', label: t.nav.contact },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-[#080808]/90 backdrop-blur-xl border-b border-gold/10 py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="NeoTech Forum"
            width={120}
            height={60}
            style={{
              objectFit: 'contain',
              width: scrolled ? '72px' : '160px',
              height: scrolled ? '36px' : '80px',
              transition: 'width 0.4s ease, height 0.4s ease',
            }}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-gold',
                pathname === link.href ? 'text-gold' : 'text-white/70'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
            className="text-xs font-medium text-white/50 hover:text-white transition-colors tracking-widest border border-white/10 px-2 py-1 rounded"
          >
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>
          <Link
            href="/reserver"
            className="bg-gold hover:bg-gold-light text-bg text-sm font-semibold px-5 py-2 rounded transition-colors"
          >
            {t.nav.reserveCta}
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
            className="text-xs font-medium text-white/50 hover:text-white transition-colors tracking-widest border border-white/10 px-2 py-1 rounded"
          >
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white/70 hover:text-white transition-colors"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#080808]/95 backdrop-blur-xl border-t border-gold/10 px-6 py-6 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'text-base font-medium transition-colors hover:text-gold py-1',
                pathname === link.href ? 'text-gold' : 'text-white/70'
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/reserver"
            onClick={() => setMenuOpen(false)}
            className="bg-gold text-bg text-sm font-semibold px-5 py-3 rounded text-center mt-2"
          >
            {t.nav.reserveCta}
          </Link>
        </div>
      )}
    </header>
  )
}
