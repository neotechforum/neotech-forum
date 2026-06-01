import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/providers/Providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

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

export const metadata: Metadata = {
  title: 'NeoTech Forum — Genève 2026 | IA · Blockchain · Tech Émergente',
  description:
    "Forum premium B2B réunissant 200 décideurs autour de l'IA, la blockchain et les technologies émergentes. Genève, Septembre 2026. Organisé par EagleChain SA.",
  keywords: ['NeoTech Forum', 'IA', 'Blockchain', 'Genève', 'Forum B2B', 'EagleChain'],
  icons: {
    icon: '/favicon-logo.png',
    apple: '/favicon-logo.png',
  },
  openGraph: {
    title: 'NeoTech Forum — Genève 2026',
    description: '200 décideurs. Une demi-journée pour transformer votre vision en stratégie.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-bg text-white font-body antialiased overflow-x-hidden">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
