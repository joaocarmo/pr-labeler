FROM node:22-slim

WORKDIR /app

RUN corepack enable \
    && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml tsconfig.json ./

RUN pnpm install --frozen-lockfile

ENV NODE_ENV="production"

COPY . .

RUN pnpm build

RUN pnpm store prune

CMD [ "pnpm", "start" ]
