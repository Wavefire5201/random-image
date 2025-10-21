# random image

had a random idea to have a random image for my profile readme every time someone
reloaded the page so I made this project.

#### what it do?

by default, when github requests a server for an image, it will cache it
(for obvious reasons). but, to get the super duper cool image change on every refresh,
how do we achieve this? simple, we just force github to make a new request every
single time by telling it to not cache the image (check line 40 in `index.ts`).
since there won't be any caching, i have also made sure to optimize my image
files so they will load quickly.

---

run with docker:

```bash
docker build --pull -t random-image .
docker run -d -p 3000:3000 -v ./images:/images random-image
```

run locally:

```bash
bun install
bun run index.ts
```

This project was created using `bun init` in bun v1.2.8. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
