export const runtime = 'edge'

import { ImageResponse } from 'next/og'

export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#FAF3E8',
          width: '100%',
          height: '100%',
          display: 'flex',
          padding: '40px',
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '72px',
            background: '#FFFFFF',
            border: '6px solid #0D0D0D',
            boxShadow: '16px 16px 0 0 #0D0D0D',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              background: '#0D0D0D',
              color: '#FAF3E8',
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              padding: '8px 16px',
              marginBottom: '36px',
            }}
          >
            GRC · VAPT · SECOPS
          </div>
          <div style={{ color: '#0D0D0D', fontSize: '76px', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-2px' }}>
            Rizky Aditya
          </div>
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              background: '#FFD12E',
              border: '4px solid #0D0D0D',
              boxShadow: '6px 6px 0 0 #0D0D0D',
              color: '#0D0D0D',
              fontSize: '24px',
              fontWeight: 700,
              padding: '10px 18px',
              marginTop: '28px',
            }}
          >
            GRC Consultant · Penetration Tester · Security Engineer
          </div>
          <div style={{ display: 'flex', gap: '28px', color: '#7C3AED', fontSize: '19px', fontWeight: 700, marginTop: '56px' }}>
            <span>aditya@cloudsphere.id</span>
            <span style={{ color: '#7A736A' }}>onerrorkx.pages.dev</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
