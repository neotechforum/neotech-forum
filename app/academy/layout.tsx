import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NeoTech Academy · Formations IA & Blockchain pour Entreprises',
  description: "Formations premium en IA, Blockchain et Transformation digitale pour dirigeants et cadres. Executive Briefing, Management Workshops, Sector Programs. Par EagleChain SA, Genève.",
  keywords: ['formation IA entreprise', 'formation blockchain dirigeants', 'NeoTech Academy', 'EagleChain formation', 'formation transformation digitale Genève'],
  alternates: { canonical: 'https://neotech-forum.ch/academy' },
  openGraph: {
    title: 'NeoTech Academy · Formations IA & Blockchain pour Entreprises',
    description: "Formations premium pour dirigeants et cadres : IA, Blockchain, Transformation digitale. Formats courts et concrets par EagleChain SA.",
    url: 'https://neotech-forum.ch/academy',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
