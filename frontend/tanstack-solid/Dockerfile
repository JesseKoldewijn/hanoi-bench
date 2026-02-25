# Build stage: Volta for Node/Yarn version pinning
# Build context: repo root (monorepo with workspaces)
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

# Copy workspace root and packages
COPY package.json yarn.lock ./
COPY frontend/tanstack-solid frontend/tanstack-solid
COPY results-site results-site
RUN yarn install --frozen-lockfile

ARG VITE_BACKEND_RUST=http://localhost:6001
ARG VITE_BACKEND_GO=http://localhost:6002
ENV VITE_BACKEND_RUST=$VITE_BACKEND_RUST
ENV VITE_BACKEND_GO=$VITE_BACKEND_GO
RUN yarn workspace hanoi-bench-frontend-tanstack-solid build

# Runtime stage
FROM debian:bookworm-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libatomic1 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /root/.volta /root/.volta
ENV VOLTA_HOME=/root/.volta
ENV PATH=$VOLTA_HOME/bin:$PATH

ENV NODE_ENV=production
ENV PORT=3001

COPY package.json yarn.lock ./
COPY frontend/tanstack-solid/package.json frontend/tanstack-solid/
COPY results-site/package.json results-site/
RUN yarn install --frozen-lockfile

COPY --from=builder /app/frontend/tanstack-solid/.output ./frontend/tanstack-solid/.output

EXPOSE ${PORT}
WORKDIR /app/frontend/tanstack-solid
CMD ["node", ".output/server/index.mjs"]
