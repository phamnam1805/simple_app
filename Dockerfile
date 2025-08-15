## Multi-stage Dockerfile for NestJS (build + production runtime)
# Uses Node 20 Alpine for small images

# 1) Install all dependencies (including dev) for building
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2) Build the NestJS app
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3) Install only production dependencies for a lean runtime
FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# 4) Final runtime image
FROM node:20-alpine AS runner
WORKDIR /app
RUN mkdir -p /app/assets/videos
ENV NODE_ENV=production

# Copy production node_modules and built artifacts
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Expose the port your Nest app listens on (main.ts uses PORT or 3000)
EXPOSE 3000

# Start the server
CMD ["node", "dist/main.js"]

