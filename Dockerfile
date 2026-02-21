# ─── Stage 1: Install dependencies ───────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ─── Stage 2: Build TanStack Start (Nitro SSR) ────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# VITE_API_URL is baked into the client bundle at build time
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# ─── Stage 3: Production image ────────────────────────────────────────────────
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
# Nitro respects the PORT env variable
ENV PORT=3000

# Copy only the Nitro output (server + public assets)
COPY --from=builder /app/.output ./.output

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["node", ".output/server/index.mjs"]
