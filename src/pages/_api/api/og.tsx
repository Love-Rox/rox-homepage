import { ImageResponse } from "workers-og";
import { env } from "cloudflare:workers";
import fontUrl from "../../../../public/assets/fonts/m-plus-rounded-1c-japanese-700-normal.woff?url";
import logoUrl from "../../../../public/assets/logos/svg/rox-horizontal.svg?url";
import { extractParams, pickTitleFontSize } from "@/lib/og-helpers";

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

export default async function OGImage(input: unknown) {
  const { title, eyebrow, author } = extractParams(input);
  const [font, logo] = await Promise.all([loadFont(), loadLogo()]);
  const titleFontSize = pickTitleFontSize(title);

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: "#fbf3e8",
        backgroundImage:
          "radial-gradient(circle at 18px 18px, rgba(26, 24, 21, 0.07) 1.1px, transparent 1.6px)",
        backgroundSize: "36px 36px",
        fontFamily: '"M PLUS Rounded 1c"',
        color: "#1a1815",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 220,
          display: "flex",
          backgroundImage:
            "linear-gradient(180deg, rgba(255, 91, 17, 0.07) 0%, rgba(255, 91, 17, 0) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 16,
          display: "flex",
          backgroundColor: "#ff5b11",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 32,
          bottom: 0,
          width: 2,
          display: "flex",
          backgroundColor: "rgba(255, 91, 17, 0.28)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 56,
          right: 56,
          width: 14,
          height: 14,
          display: "flex",
          backgroundColor: "#ff5b11",
          transform: "rotate(45deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 64,
          right: 56,
          width: 14,
          height: 14,
          display: "flex",
          backgroundColor: "#1a1815",
          transform: "rotate(45deg)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          padding: "70px 110px 60px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <img src={logo} height={52} style={{ objectFit: "contain" }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 18,
              letterSpacing: "0.34em",
              color: "#9b8a7a",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            <span style={{ display: "flex" }}>love-rox.cc</span>
            <span style={{ display: "flex", margin: "0 14px" }}>/</span>
            <span style={{ display: "flex" }}>MMXXVI</span>
          </div>
        </div>

        <div style={{ display: "flex", flex: 1 }} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 60,
              height: 4,
              backgroundColor: "#ff5b11",
              marginRight: 20,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: "0.34em",
              color: "#ff5b11",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: titleFontSize,
            lineHeight: 1.08,
            fontWeight: 700,
            color: "#1a1815",
            letterSpacing: "-0.01em",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", flex: 1 }} />

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            width: "100%",
            marginTop: 48,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 14,
                letterSpacing: "0.34em",
                color: "#9b8a7a",
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              Published by
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 28,
                color: "#1a1815",
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              {author}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 14,
                letterSpacing: "0.34em",
                color: "#9b8a7a",
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              <span style={{ display: "flex" }}>Misskey API</span>
              <span style={{ display: "flex", margin: "0 10px" }}>·</span>
              <span style={{ display: "flex" }}>Federated</span>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 18,
                color: "#6b6058",
                fontWeight: 700,
                letterSpacing: "0.02em",
              }}
            >
              The Lightweight ActivityPub Server
            </div>
          </div>
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
