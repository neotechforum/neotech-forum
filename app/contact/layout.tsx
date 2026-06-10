import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact · NeoTech Forum Genève 2026',
  description: "Contactez l'équipe NeoTech Forum pour précommander votre place, un partenariat, une demande presse ou toute question. Réponse sous 48h. contact@neotech-forum.ch",
  alternates: { canonical: 'https://neotech-forum.ch/contact' },
  openGraph: {
    title: 'Contact · NeoTech Forum Genève 2026',
    description: "Précommandez votre place ou contactez l'équipe EagleChain SA. Billetterie bientôt disponible.",
    url: 'https://neotech-forum.ch/contact',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
