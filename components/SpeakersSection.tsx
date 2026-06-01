'use client'
import Image from 'next/image'
import { useLanguage } from '@/context/LanguageContext'
import AnimatedSection from './AnimatedSection'

function SpeakerCard({
  name,
  title,
  bio,
  tags,
  imgSeed,
}: {
  name: string
  title: string
  bio: string
  tags: readonly string[]
  imgSeed: number
}) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden group hover:border-gold/30 hover:shadow-[0_0_40px_rgba(201,168,76,0.07)] transition-all duration-500">
      {/* Photo */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={`https://picsum.photos/seed/${imgSeed}/480/320`}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-heading text-xl font-semibold text-white mb-1">{name}</h3>
        <p className="text-gold text-sm font-medium mb-4">{title}</p>
        <p className="text-white/50 text-sm leading-relaxed mb-5">{bio}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="text-xs text-electric bg-electric/10 border border-electric/20 px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function MysteryCard({ data }: { data: ReturnType<typeof useLanguage>['t']['speakers']['mystery'] }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden relative group border-gold/25 hover:border-gold/50 transition-all duration-500 hover:shadow-[0_0_50px_rgba(201,168,76,0.12)]">
      {/* Blurred photo */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src="https://picsum.photos/seed/mystery42/480/320"
          alt="Mystery Speaker"
          fill
          className="object-cover blur-xl scale-110 grayscale"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-[#080808]/60" />

        {/* Pulsing badge */}
        <div className="absolute top-4 right-4 animate-pulse-gold">
          <span className="bg-gold text-bg text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(201,168,76,0.5)]">
            {data.name}
          </span>
        </div>

        {/* Silhouette */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 100 120" className="w-24 h-28 opacity-30 fill-white">
            <circle cx="50" cy="35" r="22" />
            <ellipse cx="50" cy="95" rx="35" ry="25" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-heading text-xl font-semibold text-white/30 blur-[4px] select-none">
            ██████ ████
          </h3>
        </div>
        <p className="text-gold text-sm font-medium mb-4">{data.title}</p>
        <p className="text-white/50 text-sm leading-relaxed mb-3">{data.bio}</p>
        <p className="text-gold/70 text-xs font-medium italic mb-5">{data.reveal}</p>
        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag) => (
            <span key={tag} className="text-xs text-electric bg-electric/10 border border-electric/20 px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function SpeakersSection() {
  const { t } = useLanguage()

  return (
    <section className="section-padding px-6 bg-bg">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <p className="text-gold text-xs tracking-widest uppercase mb-4">Intervenants / Speakers</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
              {t.speakers.title}
            </h2>
            <p className="text-white/40 text-base max-w-xl mx-auto">{t.speakers.subtitle}</p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.speakers.items.map((speaker, i) => (
            <AnimatedSection key={i} delay={i * 0.12}>
              <SpeakerCard
                name={speaker.name}
                title={speaker.title}
                bio={speaker.bio}
                tags={speaker.tags}
                imgSeed={i === 0 ? 10 : 20}
              />
            </AnimatedSection>
          ))}
          <AnimatedSection delay={0.24}>
            <MysteryCard data={t.speakers.mystery} />
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
