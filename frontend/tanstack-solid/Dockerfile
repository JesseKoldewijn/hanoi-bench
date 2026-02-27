# Build stage: Volta for Node/Yarn version pinning (matches Waku)
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

COPY package.json .yarnrc.yml yarn.lock ./
COPY .yarn .yarn/
RUN yarn install --immutable

COPY . .
RUN yarn run build

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
