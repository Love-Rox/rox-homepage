import { env } from "cloudflare:workers";

export const getConfig = async () => {
  return { render: "dynamic" };
};

// Static fallback OG image.
//
// The previous implementation generated dynamic OG cards with satori +
// `@resvg/resvg-wasm`. The wasm-bindgen-generated init path inside
// `@resvg/resvg-wasm` calls `WebAssembly.instantiate(bytes)` at runtime,
// which the Cloudflare Workers runtime blocks ("Wasm code generation
// disallowed by embedder"). Until we swap to a Workers-compatible OG
// library (e.g. `workers-og`), this route returns a static logo PNG so
// social previews still resolve.
const FALLBACK_ASSET_PATH = "/assets/logos/png/rox-horizontal@2x.png";

export default async function OGImage(_input: unknown) {
  const res = await env.ASSETS.fetch(new Request(`https://assets.local${FALLBACK_ASSET_PATH}`));
  if (!res.ok) {
    return new Response("OG fallback asset not found", { status: 500 });
  }
  return new Response(res.body, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
