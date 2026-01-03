import { readdirSync } from 'node:fs';
import path from 'node:path';

const basePath = process.env.IMAGE_PATH ?? "./images/";

const log = (req: Request, status: number, extra?: string) => {
  const now = new Date().toISOString();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const method = req.method;
  const url = new URL(req.url).pathname;
  const suffix = extra ? ` (${extra})` : "";
  console.log(`[${now}] ${ip} ${method} ${url} -> ${status}${suffix}`);
};
const images = readdirSync(basePath).map(image => {
  return path.join(basePath, image);
});

const getContentType = (filename: string) => {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    default:
      return "application/octet-stream";
  }
};

Bun.serve({
  port: 3000,
  fetch(request) {
    const url = new URL(request.url);
    if (url.pathname !== "/" && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.slice(0, -1);
    }

    if (url.pathname.startsWith("/random")) {
      const imagePath = images[Math.floor(Math.random() * images.length)]!;
      const file = Bun.file(imagePath);

      if (file.size > 0) {
        log(request, 200, path.basename(imagePath));
        return new Response(file,
          {
            headers: {
              "Content-Type": getContentType(imagePath),
              "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
              "Pragma": "no-cache",
              "Expires": "0",
            }
          });
      } else {
        log(request, 404, "file empty");
        return new Response("Image not found", { status: 404 });
      }
    }

    log(request, 404);
    return new Response("Not found", { status: 404 });
  },
});

console.log(`[${new Date().toISOString()}] Server started on port 3000`)
