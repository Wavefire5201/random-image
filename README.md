# random image

had a random idea to have a random image for my profile readme every time someone
reloaded the page so I made this project.

#### what it do?

by default, when github requests a server for an image, it will cache it
(for obvious reasons). but, to get the super duper cool image change on every refresh,
how do we achieve this? simple, we just force github to make a new request every
single time by telling it to not cache the image (the `no-cache` response headers).
since there won't be any caching, i have also made sure to optimize my image
files so they will load quickly.

point your readme at `https://<your-deployment>/random`.

---

### deploy to cloudflare workers (free, always-on)

the `images/` folder is bundled with the worker as static assets and served with
the same no-cache headers. add or remove images in `images/` and the filename list
is regenerated automatically on deploy.

```bash
bun install
bunx wrangler login   # one-time
bun run deploy        # wrangler deploy
```

local dev: `bun run dev` (runs `wrangler dev`), then hit `http://localhost:8787/random`.

---

### run with docker (vps / self-host)

uses the original `index.ts` bun server.

```bash
docker build --pull -t random-image .
docker run -d -p 3000:3000 -v ./images:/images random-image

# or with docker compose
docker compose up -d
```

run locally:

```bash
bun install
bun run index.ts
```
