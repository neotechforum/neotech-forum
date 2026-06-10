import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Programme · NeoTech Forum Genève 2026',
  description: "Programme complet du NeoTech Forum 2026 : conférences IA & Blockchain, table ronde, cocktail VIP et dîner exclusif. 19 septembre 2026, Hôtel Président Wilson, Genève.",
  alternates: { canonical: 'https://neotech-forum.ch/programme' },
  openGraph: {
    title: 'Programme · NeoTech Forum Genève 2026',
    description: "De 14h à 20h : conférences, table ronde, cocktail VIP Glow Bar et dîner exclusif avec les intervenants.",
    url: 'https://neotech-forum.ch/programme',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
