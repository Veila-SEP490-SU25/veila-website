# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.15.0
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /usr/src/app
ENV NODE_ENV=production

# Cài dependencies production
FROM base AS deps
COPY package.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install --legacy-peer-deps

# Build app với devDependencies
FROM base AS build
COPY package.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Final image tối giản để chạy
FROM base AS final

USER node

COPY --chown=node:node package.json ./
COPY --from=deps --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=node:node /usr/src/app/.next ./.next
COPY --from=build --chown=node:node /usr/src/app/public ./public

EXPOSE 3000
CMD ["npm", "run", "start"]
