import manifest from "./manifest.json";

const images = manifest as string[];

const noCacheHeaders: Record<string, string> = {
  "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0",
};

interface Env {
  ASSETS: Fetcher;
}

const log = (request: Request, status: number, extra?: string) => {
  const now = new Date().toISOString();
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const ua = request.headers.get("user-agent") ?? "unknown";
  // GitHub fetches readme images through its Camo proxy, which identifies itself
  // in the UA. Everything else is a direct hit (browser, bot, curl) with a real IP.
  const via = /camo/i.test(ua) ? "camo" : "direct";
  const method = request.method;
  const pathname = new URL(request.url).pathname;
  const suffix = extra ? ` (${extra})` : "";
  console.log(`[${now}] ${via} ${ip} "${ua}" ${method} ${pathname} -> ${status}${suffix}`);
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== "/" && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.slice(0, -1);
    }

    if (url.pathname.startsWith("/random")) {
      if (images.length === 0) {
        log(request, 404, "no images");
        return new Response("Image not found", { status: 404 });
      }

      const name = images[Math.floor(Math.random() * images.length)]!;
      // Pull the bundled asset through the ASSETS binding (sets Content-Type for us),
      // then re-emit it with our anti-cache headers so GitHub's Camo proxy refetches.
      const asset = await env.ASSETS.fetch(new URL(`/${name}`, url.origin));

      if (!asset.ok) {
        log(request, 404, `missing ${name}`);
        return new Response("Image not found", { status: 404 });
      }

      const headers = new Headers(asset.headers);
      for (const [key, value] of Object.entries(noCacheHeaders)) {
        headers.set(key, value);
      }

      log(request, 200, name);
      return new Response(asset.body, { status: 200, headers });
    }

    log(request, 404);
    return new Response("Not found", { status: 404 });
  },
};
