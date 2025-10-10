FROM oven/bun:debian

WORKDIR /app
COPY package.json .
COPY bun.lock .
COPY index.ts .
RUN bun install

ENV IMAGE_PATH=/images
EXPOSE 3000

CMD ["bun", "run", "index.ts"]
