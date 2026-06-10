import type { Metadata } from 'next'
import { Space_Grotesk, Inter, Orbitron } from 'next/font/google'
import './globals.css'
import Providers from '@/providers/Providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['300', '400', '500', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600'],
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-tech',
  weight: ['700', '800', '900'],
})


const BASE = 'https://neotech-forum.ch'

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'NeoTech Forum · Genève 2026 | IA · Blockchain · Transformation Digitale',
    template: '%s · NeoTech Forum Genève 2026',
  },
  description:
    "NeoTech Forum 2026 — 150 dirigeants, cadres et investisseurs réunis autour de l'IA, la Blockchain et la transformation digitale. Le 19 septembre 2026 à l'Hôtel Président Wilson, Genève. Conférences, table ronde, cocktail VIP et dîner exclusif avec les intervenants. Organisé par EagleChain SA.",
  keywords: [
    'NeoTech Forum 2026', 'forum IA Genève', 'forum blockchain Suisse', 'EagleChain SA',
    'conférence intelligence artificielle Genève', 'événement blockchain Suisse 2026',
    'forum décideurs Genève', 'transformation digitale entreprise', 'DeFi actifs numériques',
    'Hôtel Président Wilson événement', 'forum tech Genève 2026', 'conférence IA blockchain',
    'Digital Product Passport', 'forum B2B Suisse', 'IA générative entreprise',
    'agents IA automatisation', 'réglementation blockchain Europe', 'networking premium Genève',
    'NeoTech Academy EagleChain', 'formation IA dirigeants Suisse',
  ],
  authors: [{ name: 'EagleChain SA', url: 'https://eaglechain.ch' }],
  creator: 'EagleChain SA',
  publisher: 'EagleChain SA',
  category: 'Technology Event',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: BASE,
    languages: { 'fr-CH': BASE, 'en': `${BASE}/en` },
  },
  icons: {
    icon: '/favicon-logo.png',
    apple: '/favicon-logo.png',
    shortcut: '/favicon-logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_CH',
    url: BASE,
    siteName: 'NeoTech Forum',
    title: 'NeoTech Forum · Genève 2026 | IA · Blockchain · Transformation Digitale',
    description: "150 dirigeants et décideurs réunis le 19 septembre 2026 à l'Hôtel Président Wilson, Genève. Conférences IA & Blockchain, cocktail VIP, dîner exclusif. Par EagleChain SA.",
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'NeoTech Forum Genève 2026 — IA · Blockchain · Transformation Digitale' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeoTech Forum · Genève 2026',
    description: "150 décideurs · IA, Blockchain, Transformation Digitale · Hôtel Président Wilson · 19 septembre 2026 · Par EagleChain SA.",
    images: ['/opengraph-image.png'],
    creator: '@neotechforum',
  },
  verification: {
    google: '',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'EagleChain SA',
  url: 'https://eaglechain.ch',
  logo: 'https://neotech-forum.ch/logo.png',
  contactPoint: { '@type': 'ContactPoint', email: 'contact@eaglechain.ch', contactType: 'customer service' },
  address: { '@type': 'PostalAddress', addressLocality: 'Genève', addressCountry: 'CH' },
  sameAs: ['https://eaglechain.ch'],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NeoTech Forum',
  url: 'https://neotech-forum.ch',
  description: "Forum premium B2B dédié à l'IA, la Blockchain et la transformation digitale. Genève, Suisse.",
  inLanguage: ['fr-CH', 'en'],
  publisher: { '@type': 'Organization', name: 'EagleChain SA' },
}

const eventSchema = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'NeoTech Forum 2026',
  description: "Forum premium B2B réunissant 150 décideurs autour de l'IA, la blockchain et la transformation digitale.",
  startDate: '2026-09-19T14:00:00+02:00',
  endDate: '2026-09-19T22:00:00+02:00',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'Hôtel Président Wilson',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '47 Quai Wilson',
      addressLocality: 'Genève',
      postalCode: '1201',
      addressCountry: 'CH',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 46.2128, longitude: 6.1547 },
  },
  organizer: { '@type': 'Organization', name: 'EagleChain SA', url: 'https://eaglechain.ch' },
  image: 'https://neotech-forum.ch/hero.jpg',
  url: 'https://neotech-forum.ch',
  offers: [
    { '@type': 'Offer', name: 'Standard', price: '140', priceCurrency: 'CHF', availability: 'https://schema.org/PreSale', url: 'https://neotech-forum.ch/contact' },
    { '@type': 'Offer', name: 'Business VIP', price: '290', priceCurrency: 'CHF', availability: 'https://schema.org/PreSale', url: 'https://neotech-forum.ch/contact' },
    { '@type': 'Offer', name: 'Dîner Exclusif', price: '590', priceCurrency: 'CHF', availability: 'https://schema.org/LimitedAvailability', url: 'https://neotech-forum.ch/contact' },
  ],
  performer: [
    { '@type': 'Person', name: 'Maxime Vidal', jobTitle: 'Lead IA · Yves Saint Laurent' },
    { '@type': 'Person', name: 'Jonathan Oks', jobTitle: 'Expert Blockchain & Marchés Numériques' },
    { '@type': 'Person', name: 'Joseph Mont', jobTitle: 'Fondateur de PIVOIA' },
  ],
  typicalAgeRange: '25-',
  audience: { '@type': 'Audience', audienceType: 'Dirigeants, cadres, investisseurs, décideurs B2B' },
  keywords: 'IA, blockchain, transformation digitale, forum, Genève, décideurs, DeFi, actifs numériques',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quand a lieu le NeoTech Forum 2026 ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Le NeoTech Forum 2026 se tient le 19 septembre 2026 à Genève, Suisse.' },
    },
    {
      '@type': 'Question',
      name: 'Où se déroule le NeoTech Forum ?',
      acceptedAnswer: { '@type': 'Answer', text: "Le NeoTech Forum 2026 se déroule à l'Hôtel Président Wilson, 47 Quai Wilson, 1201 Genève, Suisse." },
    },
    {
      '@type': 'Question',
      name: 'Qui organise le NeoTech Forum ?',
      acceptedAnswer: { '@type': 'Answer', text: "Le NeoTech Forum est organisé par EagleChain SA, société basée à Genève, spécialisée dans les événements B2B autour des technologies émergentes." },
    },
    {
      '@type': 'Question',
      name: 'Quel est le prix pour participer au NeoTech Forum ?',
      acceptedAnswer: { '@type': 'Answer', text: "Les tarifs débutent à 140 CHF (pass Standard), 290 CHF (Business VIP avec cocktail lounge) et 590 CHF (Dîner Exclusif avec les intervenants, repas offert). La billetterie ouvre prochainement." },
    },
    {
      '@type': 'Question',
      name: 'Quels sujets sont abordés au NeoTech Forum ?',
      acceptedAnswer: { '@type': 'Answer', text: "Le NeoTech Forum aborde l'Intelligence Artificielle (IA générative, agents IA, automatisation), la Blockchain (DeFi, actifs numériques, réglementation suisse, Digital Product Passport), et la transformation digitale des entreprises." },
    },
    {
      '@type': 'Question',
      name: 'Qui sont les intervenants du NeoTech Forum 2026 ?',
      acceptedAnswer: { '@type': 'Answer', text: "Les intervenants confirmés sont Maxime Vidal (Lead IA chez Yves Saint Laurent, intervenant VivaTech 2025 & 2026), Jonathan Oks (Expert Blockchain & Marchés Numériques) et Joseph Mont (Fondateur de PIVOIA, expert IA en entreprise)." },
    },
    {
      '@type': 'Question',
      name: 'Comment s\'inscrire au NeoTech Forum ?',
      acceptedAnswer: { '@type': 'Answer', text: "La billetterie officielle ouvre prochainement. Vous pouvez dès maintenant précommander votre place en contactant l'équipe via le formulaire sur neotech-forum.ch/contact ou par email à contact@neotech-forum.ch." },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${inter.variable} ${orbitron.variable}`}>
      <body className="bg-bg text-white font-body antialiased overflow-x-hidden">
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <JsonLd data={eventSchema} />
        <JsonLd data={faqSchema} />
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
