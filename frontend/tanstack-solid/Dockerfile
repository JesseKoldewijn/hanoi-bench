# Build stage
FROM node:22-bookworm-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libatomic1 \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
ARG VITE_BACKEND_RUST=http://localhost:6001
ARG VITE_BACKEND_GO=http://localhost:6002
ENV VITE_BACKEND_RUST=$VITE_BACKEND_RUST
ENV VITE_BACKEND_GO=$VITE_BACKEND_GO
RUN npm run build

# Runtime stage
FROM node:22-bookworm-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libatomic1 \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0

COPY --from=builder /app/.output .output

EXPOSE ${PORT}
CMD ["node", ".output/server/index.mjs"]
