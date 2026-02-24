# Build stage: Volta for Node/Yarn version pinning
FROM debian:bookworm-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    libatomic1 \
    && rm -rf /var/lib/apt/lists/*

ENV VOLTA_HOME=/root/.volta
ENV PATH=$VOLTA_HOME/bin:$PATH
RUN curl https://get.volta.sh | bash \
    && volta install node yarn

# Copy full source first so Yarn 4 lockfile resolution sees the workspace package
COPY . .
RUN yarn install

ARG VITE_BACKEND_RUST=http://localhost:6001
ARG VITE_BACKEND_GO=http://localhost:6002
ENV VITE_BACKEND_RUST=$VITE_BACKEND_RUST
ENV VITE_BACKEND_GO=$VITE_BACKEND_GO
RUN yarn run build

# Runtime stage: copy Volta from builder (no curl/network in runtime; matches Volta setup action)
FROM debian:bookworm-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libatomic1 \
    && rm -rf /var/lib/apt/lists/*

# Use same Node/Yarn as builder and as CI (Volta action); no network fetch here
COPY --from=builder /root/.volta /root/.volta
ENV VOLTA_HOME=/root/.volta
ENV PATH=$VOLTA_HOME/bin:$PATH

ENV NODE_ENV=production
ENV PORT=3000

# Production server needs deps (e.g. Hono) at runtime
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable

COPY --from=builder /app/dist ./dist

EXPOSE ${PORT}
# Standalone entry; do not use "waku start" in Docker (see waku.gg/guides/docker)
CMD ["node", "dist/serve-node.js"]
