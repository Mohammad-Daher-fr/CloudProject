# STAGE 1 : build 
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src

RUN npm run build
RUN npm prune --omit=dev   # garder seulement deps de prod

# STAGE 2 : run 
FROM alpine:3.20 AS runner
WORKDIR /app
RUN apk add --no-cache nodejs

# user non-root
RUN addgroup -S node && adduser -S node -G node
USER node

# copier uniquement ce qui est utile à l'exécution
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules

EXPOSE 8000
CMD ["node", "dist/index.js"]
