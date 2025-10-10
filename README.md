# random image

had a random idea to have a random image for my profile readme every time someone
reloaded the page so I made this project.

---

run with docker:

```bash
docker build --pull -t random-image .
docker run -d -p 3000:3000 -v ./images:/images random-image
```

---

run locally:

```bash
bun install
bun run index.ts
```

This project was created using `bun init` in bun v1.2.8. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
