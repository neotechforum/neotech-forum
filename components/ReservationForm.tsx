'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'

const schema = z.object({
  nom: z.string().min(2),
  prenom: z.string().min(2),
  email: z.string().email(),
  entreprise: z.string().min(2),
  poste: z.string().min(2),
  telephone: z.string().min(6),
  pass: z.string().min(1),
  message: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/60 text-sm font-medium">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}

const inputClass =
  'bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/50 focus:bg-white/[0.06] transition-all'

export default function ReservationForm() {
  const { t } = useLanguage()
  const f = t.reservationForm
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormValues) => {
    const res = await fetch('/api/reserver', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="glass-card rounded-2xl p-12 flex flex-col items-center text-center gap-6">
        <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-gold" />
        </div>
        <div>
          <h3 className="font-heading text-2xl font-semibold text-white mb-3">{f.success.title}</h3>
          <p className="text-white/50 text-base leading-relaxed max-w-md">{f.success.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-2xl p-8">
      <h3 className="font-heading text-2xl font-semibold text-white mb-2">{f.title}</h3>
      <p className="text-white/40 text-sm mb-8">{f.subtitle}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label={f.fields.nom} error={errors.nom?.message}>
            <input {...register('nom')} placeholder={f.fields.nom} className={inputClass} />
          </Field>
          <Field label={f.fields.prenom} error={errors.prenom?.message}>
            <input {...register('prenom')} placeholder={f.fields.prenom} className={inputClass} />
          </Field>
        </div>

        <Field label={f.fields.email} error={errors.email?.message}>
          <input {...register('email')} type="email" placeholder="vous@entreprise.com" className={inputClass} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label={f.fields.entreprise} error={errors.entreprise?.message}>
            <input {...register('entreprise')} placeholder={f.fields.entreprise} className={inputClass} />
          </Field>
          <Field label={f.fields.poste} error={errors.poste?.message}>
            <input {...register('poste')} placeholder={f.fields.poste} className={inputClass} />
          </Field>
        </div>

        <Field label={f.fields.telephone} error={errors.telephone?.message}>
          <input {...register('telephone')} type="tel" placeholder="+41 00 000 00 00" className={inputClass} />
        </Field>

        <Field label={f.fields.pass} error={errors.pass?.message}>
          <select {...register('pass')} className={cn(inputClass, 'cursor-pointer')}>
            <option value="" className="bg-[#080808]">— {f.fields.pass} —</option>
            {f.passOptions.map((opt) => (
              <option key={opt} value={opt} className="bg-[#080808]">{opt}</option>
            ))}
          </select>
        </Field>

        <Field label={f.fields.message}>
          <textarea
            {...register('message')}
            rows={3}
            placeholder="..."
            className={cn(inputClass, 'resize-none')}
          />
        </Field>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gold hover:bg-gold-light text-bg font-semibold py-4 rounded-lg text-sm transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {isSubmitting ? '...' : f.submit}
        </button>
      </form>
    </div>
  )
}
