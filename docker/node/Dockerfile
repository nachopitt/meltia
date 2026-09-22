# syntax=docker/dockerfile:1

# =============================================================================
# Stage: base
# Node.js 20 Alpine with system tools, non-root user matching host UID/GID
# =============================================================================
ARG USER_ID=1000
ARG GROUP_ID=1000

FROM node:20-alpine AS base

ARG USER_ID=1000
ARG GROUP_ID=1000

WORKDIR /app

# Copy host CA certificates if they exist (optional copy)
COPY docker/certs* /usr/local/share/ca-certificates/
RUN if [ -f /usr/local/share/ca-certificates/ca-certificate.crt ]; then cat /usr/local/share/ca-certificates/ca-certificate.crt >> /etc/ssl/certs/ca-certificates.crt; fi

# Install system dependencies (build-essential equivalent + psql client + init)
RUN apk add --no-cache \
    bash \
    curl \
    git \
    python3 \
    make \
    g++ \
    postgresql16-client

# Reconfigure node user or create devuser with host UID/GID for permission compatibility
RUN if id -u node >/dev/null 2>&1; then deluser --remove-home node; fi && \
    addgroup -g ${GROUP_ID} devuser && \
    adduser -u ${USER_ID} -G devuser -s /bin/bash -D devuser && \
    mkdir -p /app /home/devuser && \
    chown -R devuser:devuser /app /home/devuser

# =============================================================================
# Stage: deps
# Installs application dependencies
# =============================================================================
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/storefront/package.json ./apps/storefront/
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# =============================================================================
# Stage: builder
# Builds Medusa backend and storefront assets
# =============================================================================
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_test
ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
ARG NEXT_PUBLIC_BASE_URL=http://localhost:8080
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=${NEXT_PUBLIC_MEDUSA_BACKEND_URL}
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}

# Run build scripts if defined
RUN npm run build --if-present

# =============================================================================
# Stage: prod
# Minimal production runtime
# =============================================================================
FROM node:20-alpine AS prod
WORKDIR /app

RUN apk add --no-cache postgresql16-client

# Create devuser in prod runtime
ARG USER_ID=1000
ARG GROUP_ID=1000
RUN if id -u node >/dev/null 2>&1; then deluser --remove-home node; fi && \
    addgroup -g ${GROUP_ID} devuser && \
    adduser -u ${USER_ID} -G devuser -s /bin/bash -D devuser

COPY --from=builder /app /app
COPY docker/node/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh && chown -R devuser:devuser /app

USER devuser
EXPOSE 9000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm", "run", "start"]

# =============================================================================
# Stage: dev
# Local development stage with live-reload support
# =============================================================================
FROM base AS dev
WORKDIR /app

COPY docker/node/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 9000 5173 8000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm", "run", "dev"]

# =============================================================================
# Stage: workspace
# Developer CLI container for running npm, npx medusa, tests
# =============================================================================
FROM dev AS workspace
WORKDIR /app
CMD ["tail", "-f", "/dev/null"]

# =============================================================================
# Stage: web (nginx reverse proxy & static asset server)
# =============================================================================
FROM nginx:alpine AS web
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
