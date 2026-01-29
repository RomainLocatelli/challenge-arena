FROM node:24-alpine AS builder

WORKDIR /app

# Copier depuis le contexte (qui sera api/)
COPY package*.json ./
COPY prisma/ ./prisma/
COPY prisma.config.ts ./

RUN npm ci
COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate
RUN npm run build

FROM node:24-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

CMD ["node", "dist/index.js"]