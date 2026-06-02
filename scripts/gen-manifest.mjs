// Scans ./images and writes the filename list to src/manifest.json.
// Runs automatically before `wrangler dev` / `wrangler deploy` via the [build]
// hook in wrangler.jsonc, so adding/removing images just works — no manual edits.
import { readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const imagesDir = join(root, "images");
const outFile = join(root, "src", "manifest.json");

const images = readdirSync(imagesDir).filter((file) =>
  /\.(png|jpe?g|gif|webp|avif)$/i.test(file)
);

writeFileSync(outFile, JSON.stringify(images, null, 2) + "\n");
console.log(`gen-manifest: wrote ${images.length} images to src/manifest.json`);
