import { ImageResponse } from '@vercel/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const getConfig = async () => {
  return {
    render: 'dynamic',
  };
};

export default async function OGImage(input: any) {
  let title = 'Rox';

  // Handle standard Request object
  if (input && typeof input.url === 'string') {
    try {
      const url = new URL(input.url);
      title = url.searchParams.get('title') || 'Rox';
    } catch (e) {
      console.error('Failed to parse URL:', e);
    }
  }
  // Handle props object with searchParams or query
  else {
    const { searchParams, query } = input || {};
    if (searchParams && typeof searchParams.get === 'function') {
      title = searchParams.get('title') || 'Rox';
    } else if (typeof query === 'string') {
      const params = new URLSearchParams(query);
      title = params.get('title') || 'Rox';
    } else if (query && typeof query === 'object') {
      title = query.title || 'Rox';
    }
  }

  // Load font
  const fontPath = join(process.cwd(), 'node_modules/@fontsource/m-plus-rounded-1c/files/m-plus-rounded-1c-japanese-700-normal.woff');
  const fontData = readFileSync(fontPath);

  // Load logo
  const logoPath = join(process.cwd(), 'public/assets/logos/svg/rox-horizontal.svg');
  const logoData = readFileSync(logoPath);
  const logoBase64 = logoData.toString('base64');
  const logoSrc = `data:image/svg+xml;base64,${logoBase64}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff7ed', // orange-50
          backgroundImage: 'radial-gradient(circle at 25px 25px, #ffedd5 2%, transparent 0%), radial-gradient(circle at 75px 75px, #ffedd5 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          fontFamily: '"M PLUS Rounded 1c"',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '80px 120px',
            borderRadius: '40px',
            border: '2px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 30px 60px -15px rgba(255, 91, 17, 0.15)', // orange shadow
            maxWidth: '85%',
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 40,
            }}
          >
            <img
              src={logoSrc}
              height={80}
              style={{ objectFit: 'contain' }}
            />
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: '#1a202c', // gray-900
              textAlign: 'center',
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            {title}
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 24,
              color: '#ff5b11', // Primary Orange
              marginTop: 20,
              letterSpacing: '0.05em',
              fontWeight: 700,
            }}
          >
            The Lightweight ActivityPub Server
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'M PLUS Rounded 1c',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    },
  );
}
