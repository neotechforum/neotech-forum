'use client'
import Image from 'next/image'
import { MapPin, Star } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import AnimatedSection from './AnimatedSection'

export default function VenueSection() {
  const { t } = useLanguage()

  return (
    <section className="section-padding px-6 bg-[#060606]">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-12">
            <p className="text-gold text-xs tracking-widest uppercase mb-4">Lieu / Venue</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
              {t.venue.title}
            </h2>
            <p className="text-white/40 text-base">{t.venue.subtitle}</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="relative rounded-2xl overflow-hidden group">
            {/* Full-bleed image */}
            <div className="relative h-[420px] md:h-[560px]">
              <Image
                src="https://picsum.photos/seed/hotel-luxury/1400/600"
                alt="Hôtel Métropole Genève"
                fill
                className="object-cover grayscale group-hover:grayscale-[40%] transition-all duration-700 scale-100 group-hover:scale-105"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-[#080808]/20" />
            </div>

            {/* Overlay content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="max-w-2xl">
                <div className="flex items-center gap-1 text-gold mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#C9A84C" />
                  ))}
                </div>
                <h3 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">
                  {t.venue.hotel}
                </h3>
                <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
                  <MapPin size={14} className="text-gold" />
                  <span>{t.venue.address}</span>
                </div>
                <div className="flex items-center gap-3 glass-card inline-flex rounded-full px-4 py-2 text-sm text-gold">
                  <span>🥂</span>
                  <span>{t.venue.rooftop}</span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
