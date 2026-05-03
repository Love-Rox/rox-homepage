import { fsRouter } from "waku";
import adapter from "waku/adapters/cloudflare";
import { rewriteToTcy } from "@/lib/tcy-redirects";

// `adapter()` returns an object with `defaultExport` (the actual Worker handler
// the Cloudflare runtime invokes) plus build internals (INTERNAL_runBuild for SSG).
// Wrap `defaultExport.fetch` in place so the redirect layer fires before the Waku
// handler, while leaving the rest of the structure intact.
const inner = adapter(fsRouter(import.meta.glob("./**/*.{tsx,ts}", { base: "./pages" })), {
  handlers: {} satisfies ExportedHandler<Env>,
}) as { defaultExport: ExportedHandler<Env>; [k: string]: unknown };

const originalFetch = inner.defaultExport.fetch!.bind(inner.defaultExport);
inner.defaultExport.fetch = async (req, env, ctx) => {
  const target = rewriteToTcy(new URL(req.url));
  if (target) return Response.redirect(target, 301);
  return originalFetch(req, env, ctx);
};

export default inner;
