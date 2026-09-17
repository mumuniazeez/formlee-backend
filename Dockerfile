###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:26 AS development
RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm fetch --prod

COPY --chown=node:node . .
RUN pnpm install

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:26 AS build
RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml ./

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

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]
