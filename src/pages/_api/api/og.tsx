import satori from 'satori';
import { initWasm, Resvg } from '@resvg/resvg-wasm';
import { readFileSync } from 'fs';
import { join } from 'path';

export const getConfig = async () => {
  return {
    render: 'dynamic',
  };
};

let wasmInitialized = false;

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

  // Load assets
  let fontData, logoSrc;
  try {
    const fontPath = join(process.cwd(), 'public/assets/fonts/m-plus-rounded-1c-japanese-700-normal.woff');
    fontData = readFileSync(fontPath);

    const logoPath = join(process.cwd(), 'public/assets/logos/svg/rox-horizontal.svg');
    const logoData = readFileSync(logoPath);
    const logoBase64 = logoData.toString('base64');
    logoSrc = `data:image/svg+xml;base64,${logoBase64}`;
  } catch (e) {
    console.error('Failed to load assets:', e);
    // Return a fallback or error response
    return new Response('Failed to load assets: ' + (e as Error).message, { status: 500 });
  }

  // Initialize Wasm
  if (!wasmInitialized) {
    try {
      const wasmPath = join(process.cwd(), 'public/assets/resvg.wasm');
      const wasmData = readFileSync(wasmPath);
      await initWasm(wasmData);
      wasmInitialized = true;
    } catch (e) {
      // If already initialized, it might throw, but we can ignore it if it works.
      // However, initWasm checks internally.
      console.error('Failed to initialize resvg wasm:', e);
    }
  }

  const svg = await satori(
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
    </div>,
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
    }
  );

  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(Buffer.from(pngBuffer), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
