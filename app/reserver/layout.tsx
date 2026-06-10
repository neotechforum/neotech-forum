import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Réservation · NeoTech Forum Genève 2026',
  description: "Précommandez votre accès au NeoTech Forum 2026. Standard (140 CHF), Business VIP (290 CHF) ou Dîner Exclusif (590 CHF). Billetterie officielle bientôt disponible.",
  alternates: { canonical: 'https://neotech-forum.ch/reserver' },
  openGraph: {
    title: 'Réservation · NeoTech Forum Genève 2026',
    description: "Places limitées — 150 décideurs. Précommandez dès maintenant.",
    url: 'https://neotech-forum.ch/reserver',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
