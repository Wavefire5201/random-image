import { readdirSync } from 'node:fs';
import path from 'node:path';

const basePath = process.env.IMAGE_PATH ? process.env.IMAGE_PATH : "./images/";
const images = readdirSync(basePath).map(image => {
  return path.join(basePath, image);
});

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
        console.log(`Served: ${file.name}`)
        return new Response(file);
      } else {
        return new Response("Image not found", { status: 404 });
      }
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log("Started server")
