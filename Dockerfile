# ---- Base ----
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
RUN corepack enable && corepack prepare pnpm@9.15.5 --activate

# ---- Dependencies ----
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile --config.ignore-scripts=false

# ---- Build ----
FROM base AS build
COPY package.json pnpm-lock.yaml ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN pnpm run build
RUN pnpm prune --prod

# ---- Production ----
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl
RUN corepack enable && corepack prepare pnpm@9.15.5 --activate

RUN addgroup -S nodejs && adduser -S nestjs -G nodejs

COPY --from=build --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=build --chown=nestjs:nodejs /app/package.json ./package.json

USER nestjs

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]