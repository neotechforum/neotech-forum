'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Mail, Globe, Building2, MessageSquare, Newspaper, Users2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'

const schema = z.object({
  nom: z.string().min(2),
  email: z.string().email(),
  entreprise: z.string().min(2),
  objet: z.string().min(1),
  offre: z.string().optional(),
  nombrePersonnes: z.string().optional(),
  typeOffreGroupe: z.string().optional(),
  besoins: z.string().optional(),
  message: z.string().min(5),
})

type FormValues = z.infer<typeof schema>

const inputClass =
  'bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/50 focus:bg-white/[0.06] transition-all w-full'

const reasonIcons = [Building2, Newspaper, Users2, MessageSquare]

const OFFRES_FR = ['Standard · 140 CHF', 'Business VIP · 290 CHF', 'Dîner Exclusif · 590 CHF']
const OFFRES_EN = ['Standard · 140 CHF', 'Business VIP · 290 CHF', 'Exclusive Dinner · 590 CHF']

export default function ContactForm() {
  const { t, lang } = useLanguage()
  const c = t.contact
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const objet = watch('objet')
  const isPrecommande = objet === 'Précommande' || objet === 'Pre-order'
  const isGroupe = objet === 'Offre de groupe / entreprise' || objet === 'Group / corporate offer'
  const offres = lang === 'fr' ? OFFRES_FR : OFFRES_EN

  const onSubmit = async (data: FormValues) => {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) setSubmitted(true)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
      {/* Left: info */}
      <div>
        <h2 className="font-heading text-4xl font-bold text-white mb-2">{c.title}</h2>
        <p className="text-white/40 mb-10">{c.subtitle}</p>

        <div className="flex flex-col gap-5 mb-10">
          {c.reasons.map((reason, i) => {
            const Icon = reasonIcons[i] || MessageSquare
            return (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-gold" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-white text-sm mb-0.5">{reason.title}</h4>
                  <p className="text-white/40 text-sm">{reason.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="glass-card rounded-xl p-5 flex flex-col gap-3">
          <a href="mailto:contact@eaglechain.ch" className="flex items-center gap-3 text-white/60 hover:text-gold transition-colors text-sm">
            <Mail size={16} className="text-gold" />
            {c.email}
          </a>
          <a href="https://eaglechain.ch" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 hover:text-gold transition-colors text-sm">
            <Globe size={16} className="text-gold" />
            {c.website}
          </a>
          <div className="h-px bg-white/5 my-1" />
          <p className="text-white/30 text-xs">{c.organizer}</p>
        </div>
      </div>

      {/* Right: form */}
      <div>
        {submitted ? (
          <div className="glass-card rounded-2xl p-12 flex flex-col items-center text-center gap-6 h-full justify-center">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-gold" />
            </div>
            <div>
              <h3 className="font-heading text-2xl font-semibold text-white mb-3">{c.form.success.title}</h3>
              <p className="text-white/50 leading-relaxed">{c.form.success.message}</p>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">{c.form.nom}</label>
                <input {...register('nom')} placeholder={c.form.nom} className={inputClass} />
                {errors.nom && <p className="text-red-400 text-xs mt-1">{errors.nom.message}</p>}
              </div>

              <div>
                <label className="text-white/60 text-sm mb-1.5 block">{c.form.email}</label>
                <input {...register('email')} type="email" placeholder="vous@entreprise.com" className={inputClass} />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="text-white/60 text-sm mb-1.5 block">{c.form.entreprise}</label>
                <input {...register('entreprise')} placeholder={c.form.entreprise} className={inputClass} />
                {errors.entreprise && <p className="text-red-400 text-xs mt-1">{errors.entreprise.message}</p>}
              </div>

              <div>
                <label className="text-white/60 text-sm mb-1.5 block">{c.form.objet}</label>
                <select {...register('objet')} className={cn(inputClass, 'cursor-pointer')}>
                  <option value="" className="bg-[#080808]">— {c.form.objet} —</option>
                  {c.form.objetOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#080808]">{opt}</option>
                  ))}
                </select>
                {errors.objet && <p className="text-red-400 text-xs mt-1">{errors.objet.message}</p>}
              </div>

              <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(-6px) } to { opacity:1; transform:none } }`}</style>

              {/* Champ offre — Précommande */}
              {isPrecommande && (
                <div style={{ animation: 'fadeIn .25s ease' }}>
                  <label className="text-white/60 text-sm mb-1.5 block">{c.form.offre}</label>
                  <select {...register('offre')} className={cn(inputClass, 'cursor-pointer')}>
                    <option value="" className="bg-[#080808]">— {c.form.offre} —</option>
                    {offres.map((o) => (
                      <option key={o} value={o} className="bg-[#080808]">{o}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Champs groupe / entreprise */}
              {isGroupe && (
                <div style={{ animation: 'fadeIn .25s ease', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">
                      {lang === 'fr' ? 'Nombre de personnes' : 'Number of people'}
                    </label>
                    <select {...register('nombrePersonnes')} className={cn(inputClass, 'cursor-pointer')}>
                      <option value="" className="bg-[#080808]">—</option>
                      {['5 – 9', '10 – 19', '20 – 49', '50+'].map(n => (
                        <option key={n} value={n} className="bg-[#080808]">{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">
                      {lang === 'fr' ? 'Offre souhaitée pour le groupe' : 'Desired offer for the group'}
                    </label>
                    <select {...register('typeOffreGroupe')} className={cn(inputClass, 'cursor-pointer')}>
                      <option value="" className="bg-[#080808]">—</option>
                      {(lang === 'fr'
                        ? ['Standard · 140 CHF / pers.', 'Business VIP · 290 CHF / pers.', 'Dîner Exclusif · 590 CHF / pers.', 'Offre mixte', 'Sur mesure']
                        : ['Standard · 140 CHF / person', 'Business VIP · 290 CHF / person', 'Exclusive Dinner · 590 CHF / person', 'Mixed offer', 'Custom']
                      ).map(o => (
                        <option key={o} value={o} className="bg-[#080808]">{o}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">
                      {lang === 'fr' ? 'Besoins spécifiques (optionnel)' : 'Specific needs (optional)'}
                    </label>
                    <textarea
                      {...register('besoins')}
                      rows={3}
                      placeholder={lang === 'fr' ? 'Table dédiée, accès VIP, facturation entreprise...' : 'Dedicated table, VIP access, corporate billing...'}
                      className={cn(inputClass, 'resize-none')}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-white/60 text-sm mb-1.5 block">{c.form.message}</label>
                <textarea
                  {...register('message')}
                  rows={4}
                  placeholder="..."
                  className={cn(inputClass, 'resize-none')}
                />
                {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gold hover:bg-gold-light text-bg font-semibold py-4 rounded-lg text-sm transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? '...' : c.form.submit}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
