import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'NeoTech Forum · Genève 2026 · IA · Blockchain · Transformation Digitale'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#020B18',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '72px 88px',
          position: 'relative',
        }}
      >
        {/* Grid dots background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(0,170,255,0.06) 1px, transparent 1px)',
          backgroundSize: '38px 38px',
        }} />

        {/* Top gold line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
          background: 'linear-gradient(to right, #C9A84C, transparent)',
        }} />

        {/* Bottom gold line */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px',
          background: 'linear-gradient(to left, #C9A84C, transparent)',
        }} />

        {/* Date tag */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          marginBottom: '32px',
        }}>
          <div style={{ width: '28px', height: '2px', background: '#C9A84C' }} />
          <div style={{
            color: '#C9A84C', fontSize: '16px',
            letterSpacing: '4px', fontFamily: 'sans-serif',
          }}>
            19 SEPTEMBRE 2026 · GENEVE, SUISSE
          </div>
          <div style={{ width: '28px', height: '2px', background: '#C9A84C' }} />
        </div>

        {/* Main title */}
        <div style={{
          color: 'white', fontSize: '108px', fontWeight: 800,
          lineHeight: 0.88, fontFamily: 'sans-serif', letterSpacing: '-2px',
        }}>
          NEOTECH
        </div>
        <div style={{
          color: '#C9A84C', fontSize: '46px', fontWeight: 300,
          letterSpacing: '18px', fontFamily: 'sans-serif',
          marginTop: '8px', marginBottom: '40px',
        }}>
          FORUM
        </div>

        {/* Tagline */}
        <div style={{
          color: 'rgba(255,255,255,0.45)', fontSize: '20px',
          fontFamily: 'sans-serif', marginBottom: '48px',
          letterSpacing: '1px',
        }}>
          IA  ·  Blockchain  ·  Transformation Digitale
        </div>

        {/* Bottom info */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '32px',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '4px', padding: '10px 18px',
          }}>
            <div style={{ color: '#C9A84C', fontSize: '14px', fontFamily: 'sans-serif', letterSpacing: '1px' }}>
              150 DECIDEURS
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '4px', padding: '10px 18px',
          }}>
            <div style={{ color: '#C9A84C', fontSize: '14px', fontFamily: 'sans-serif', letterSpacing: '1px' }}>
              HOTEL PRESIDENT WILSON
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '4px', padding: '10px 18px',
          }}>
            <div style={{ color: '#C9A84C', fontSize: '14px', fontFamily: 'sans-serif', letterSpacing: '1px' }}>
              PAR EAGLECHAIN SA
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
