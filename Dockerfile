# syntax = docker/dockerfile:1
FROM node:20-alpine

RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy everything
COPY . .

# Install & build
RUN npm install
RUN npx prisma generate
RUN npx next build

# Prepare standalone output
RUN cp -r .next/static .next/standalone/.next/ 2>/dev/null; true
RUN cp -r public .next/standalone/ 2>/dev/null; true

# Production
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=0 /app/.next/standalone ./
COPY --from=0 /app/.next/static ./.next/static
COPY --from=0 /app/public ./public
COPY --from=0 /app/node_modules ./node_modules
COPY --from=0 /app/prisma ./prisma

RUN mkdir -p /app/db && chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["sh", "-c", "node_modules/.bin/prisma db push --accept-data-loss && node server.js"]
