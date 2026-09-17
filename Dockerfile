###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:20-alpine AS development
RUN npm install -g pnpm

WORKDIR /usr/src/app

# If this is not a pnpm workspace, drop pnpm-workspace.yaml from this line.
COPY --chown=node:node package.json pnpm-lock.yaml ./

RUN pnpm fetch --prod

COPY --chown=node:node . .
RUN pnpm install

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:20-alpine AS build
RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY --chown=node:node package.json pnpm-lock.yaml ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN pnpm build

ENV NODE_ENV=production

RUN pnpm install --prod

USER node

###################
# PRODUCTION
###################

FROM node:20-alpine AS production

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/package.json ./package.json

USER node

CMD [ "node", "dist/main.js" ]