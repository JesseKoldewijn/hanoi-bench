# TanStack Solid frontend - serves pre-built .output
FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libatomic1 \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0

# Copy pre-built output
COPY .output .output

EXPOSE ${PORT}
CMD ["node", ".output/server/index.mjs"]
