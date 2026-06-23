FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json bun.lock ./
RUN npm install -g bun && bun install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Switch to PostgreSQL schema for production
# Uncomment next line when DATABASE_URL is set in Railway Variables:
# RUN cp prisma/schema.postgresql.prisma prisma/schema.prisma

# Use project's own Prisma (v6), NOT npx which pulls latest v7
RUN ./node_modules/.bin/prisma generate
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Default SQLite path for production (switch to PostgreSQL by uncommenting line above)
ENV DATABASE_URL="file:./db/production.db"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
# Copy full node_modules for prisma CLI + all transitive deps (effect, etc.)
COPY --from=builder /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["sh", "-c", "./node_modules/.bin/prisma db push --accept-data-loss && node server.js"]
