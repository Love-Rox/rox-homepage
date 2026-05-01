import { ImageResponse } from "workers-og";
import { env } from "cloudflare:workers";
import fontUrl from "../../../../public/assets/fonts/m-plus-rounded-1c-japanese-700-normal.woff?url";
import logoUrl from "../../../../public/assets/logos/svg/rox-horizontal.svg?url";

export const getConfig = async () => {
  return { render: "dynamic" };
};

let fontData: ArrayBuffer | null = null;
let logoSrc: string | null = null;

async function fetchAsset(path: string): Promise<Response> {
  return env.ASSETS.fetch(new Request(`https://assets.local${path}`));
}

async function loadFont(): Promise<ArrayBuffer> {
  if (fontData) return fontData;
  const res = await fetchAsset(fontUrl);
  if (!res.ok) throw new Error(`Failed to load font: ${res.status}`);
  fontData = await res.arrayBuffer();
  return fontData;
}

async function loadLogo(): Promise<string> {
  if (logoSrc) return logoSrc;
  const res = await fetchAsset(logoUrl);
  if (!res.ok) throw new Error(`Failed to load logo: ${res.status}`);
  const buf = new Uint8Array(await res.arrayBuffer());
  let binary = "";
  for (let i = 0; i < buf.length; i++) binary += String.fromCharCode(buf[i]!);
  logoSrc = `data:image/svg+xml;base64,${btoa(binary)}`;
  return logoSrc;
}

function extractTitle(input: unknown): string {
  if (input && typeof input === "object") {
    const i = input as {
      url?: string;
      searchParams?: URLSearchParams;
      query?: string | Record<string, unknown>;
    };
    if (typeof i.url === "string") {
      try {
        return new URL(i.url).searchParams.get("title") ?? "Rox";
      } catch {
        // fall through
      }
    }
    if (i.searchParams && typeof i.searchParams.get === "function") {
      return i.searchParams.get("title") ?? "Rox";
    }
    if (typeof i.query === "string") {
      return new URLSearchParams(i.query).get("title") ?? "Rox";
    }
    if (i.query && typeof i.query === "object") {
      return ((i.query as Record<string, unknown>).title as string | undefined) ?? "Rox";
    }
  }
  return "Rox";
}

export default async function OGImage(input: unknown) {
  const title = extractTitle(input);
  const [font, logo] = await Promise.all([loadFont(), loadLogo()]);

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff7ed",
        backgroundImage:
          "radial-gradient(circle at 25px 25px, #ffedd5 2%, transparent 0%), radial-gradient(circle at 75px 75px, #ffedd5 2%, transparent 0%)",
        backgroundSize: "100px 100px",
        fontFamily: '"M PLUS Rounded 1c"',
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "80px 120px",
          borderRadius: "40px",
          border: "2px solid rgba(255, 255, 255, 0.8)",
          boxShadow: "0 30px 60px -15px rgba(255, 91, 17, 0.15)",
          maxWidth: "85%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <img src={logo} height={80} style={{ objectFit: "contain" }} />
        </div>

        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#1a202c",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: 20,
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: 24,
            color: "#ff5b11",
            marginTop: 20,
            letterSpacing: "0.05em",
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
          name: "M PLUS Rounded 1c",
          data: font,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );
}
