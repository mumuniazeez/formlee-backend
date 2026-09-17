###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:20-slim AS development
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ openssl \
    && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm node-gyp

WORKDIR /usr/src/app

# pnpm-workspace.yaml is required here too: it carries onlyBuiltDependencies,
# which allowlists native install scripts (argon2, @prisma/engines, etc).
COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm fetch --prod

COPY --chown=node:node . .
RUN pnpm install

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:20-slim AS build
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ openssl \
    && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm node-gyp

WORKDIR /usr/src/app

COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN pnpm exec prisma generate

RUN pnpm build

ENV NODE_ENV=production

RUN pnpm install --prod

USER node

###################
# PRODUCTION
###################

FROM node:20-slim AS production

RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/package.json ./package.json

USER node

CMD [ "node", "dist/src/main.js" ]