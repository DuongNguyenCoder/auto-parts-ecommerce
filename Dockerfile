# ==============================
# Base
# ==============================
FROM node:22-alpine AS base

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app


# ==============================
# Dependencies
# ==============================
FROM base AS deps

COPY package*.json ./

RUN npm ci


# ==============================
# Builder
# ==============================
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

ARG DATABASE_URL
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ARG NEXT_PUBLIC_CLOUDINARY_API_KEY

ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ENV NEXT_PUBLIC_CLOUDINARY_API_KEY=$NEXT_PUBLIC_CLOUDINARY_API_KEY

RUN npx prisma generate
RUN npm run build


# ==============================
# Runner
# ==============================
FROM node:22-alpine AS runner

RUN apk add --no-cache libc6-compat openssl wget

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup -S nodejs
RUN adduser -S nextjs -G nodejs

COPY --from=builder /app/public ./public

COPY --from=builder /app/.next/standalone ./

COPY --from=builder /app/.next/static ./.next/static

COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
# COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
# COPY --from=builder /app/node_modules/.bin ./node_modules/.bin

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]