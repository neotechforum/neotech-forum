'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Globe, Mail, Send, Share2, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  const events = [
    { flag: '🇨🇭', city: 'Genève / Geneva', date: 'Sept. 2026' },
    { flag: '🇸🇦', city: 'Riyad / Riyadh', date: 'Déc. 2026' },
    { flag: '🇺🇸', city: 'Denver', date: 'Avr. 2027' },
    { flag: '🇬🇧', city: 'Londres / London', date: 'Juin 2027' },
    { flag: '🇭🇰', city: 'Hong Kong', date: 'Déc. 2027' },
  ]

  return (
    <footer className="bg-[#060606] border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Image src="/logo.png" alt="NeoTech Forum" width={120} height={60} style={{ objectFit: 'contain' }} />
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6">{t.footer.tagline}</p>
            <div className="flex gap-3">
              {[Send, Share2, ExternalLink].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-gold hover:border-gold/30 transition-all"
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm uppercase tracking-widest mb-5">
              {t.footer.pages}
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { href: '/', label: t.nav.home },
                { href: '/programme', label: t.nav.programme },
                { href: '/reserver', label: t.nav.reserve },
                { href: '/contact', label: t.nav.contact },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/40 hover:text-gold text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Upcoming events */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm uppercase tracking-widest mb-5">
              {t.footer.events}
            </h4>
            <div className="flex flex-col gap-3">
              {events.map((ev, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span>{ev.flag}</span>
                  <span className="text-white/40">{ev.city}</span>
                  <span className="text-gold/60 ml-auto text-xs">{ev.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm uppercase tracking-widest mb-5">
              EagleChain SA
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:contact@eaglechain.ch"
                className="flex items-center gap-2 text-white/40 hover:text-gold text-sm transition-colors"
              >
                <Mail size={14} />
                contact@eaglechain.ch
              </a>
              <a
                href="https://eaglechain.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/40 hover:text-gold text-sm transition-colors"
              >
                <Globe size={14} />
                eaglechain.ch
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/25 text-xs">{t.footer.legal}</p>
          <p className="text-white/25 text-xs">{t.footer.allRights}</p>
        </div>
      </div>
    </footer>
  )
}
