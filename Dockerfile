# ---------------------------------------------------------------------------
# Base: shared OS packages + the non-root user used by every stage
# ---------------------------------------------------------------------------
FROM node:24-alpine AS base
WORKDIR /app

# Prisma needs OpenSSL; libc6-compat keeps glibc-linked tooling happy on Alpine
RUN apk add --no-cache libc6-compat openssl \
 && addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# ---------------------------------------------------------------------------
# Dependencies: install every dependency and generate the Prisma client
# ---------------------------------------------------------------------------
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Prisma CLI reads DATABASE_URL while generating; a placeholder is enough here
# because the real value is injected at runtime by docker-compose.
ENV DATABASE_URL="file:/app/data/prod.db"

RUN npm ci
RUN npx prisma generate

# ---------------------------------------------------------------------------
# Builder: create the Next.js production build (standalone output)
# ---------------------------------------------------------------------------
FROM deps AS builder
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY . .
RUN npm run build

# ---------------------------------------------------------------------------
# Migrator: one-shot image that applies migrations (and optionally seeds)
# ---------------------------------------------------------------------------
FROM deps AS migrator
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh \
 && mkdir -p /app/data

# Runs as root so it can repair ownership of a volume created by an older
# container, then the entrypoint hands the volume back to uid 1001.
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["true"]

# ---------------------------------------------------------------------------
# Runner: minimal production image (no build tools, no dev dependencies)
# ---------------------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# The standalone bundle already contains the traced runtime dependencies,
# including the generated Prisma client.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Never ship environment files inside the image. Compose injects them at runtime.
RUN rm -f /app/.env /app/.env.local /app/.env.*.local /app/.env.production /app/.env.development \
 && mkdir -p /app/data \
 && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
