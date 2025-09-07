# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.15.0

# ------------------------------------------------------------------------------
# Base image with node for all stages
FROM node:${NODE_VERSION} AS base

# Install cross-env globally
RUN npm install -g cross-env

# Set working directory
WORKDIR /usr/src/app

# ------------------------------------------------------------------------------
# Install production dependencies
FROM base AS deps

# Copy package files
COPY package.json ./

# Debug: Show npm and node versions
RUN node --version && npm --version

# Install production dependencies
RUN npm install --omit=dev --force

# ------------------------------------------------------------------------------
# Build the application
FROM base AS build

# Copy package files
COPY package.json ./

# Debug: Show npm and node versions
RUN node --version && npm --version

# Install all dependencies (including dev)
RUN npm install --force

# Copy source code
COPY . .

# Build the project
RUN npm run build

# ------------------------------------------------------------------------------
# Final stage with minimal runtime dependencies
FROM base AS final

# Switch to non-root user
USER node

# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY package.json .
# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/public ./public


# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD ["npm","run","start"]
