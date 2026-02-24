# Build stage
FROM golang:1.22-bookworm AS builder
WORKDIR /app

COPY go.mod ./
COPY *.go ./
COPY hanoi/ ./hanoi/

RUN go build -ldflags="-s -w" -o hanoi-bench .

# Runtime stage
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /app/hanoi-bench /app/hanoi-bench

EXPOSE 6002
ENV PORT=6002

ENTRYPOINT ["/app/hanoi-bench"]
