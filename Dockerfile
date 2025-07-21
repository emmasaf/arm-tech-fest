# 1. Build Stage
FROM oven/bun:1.1.13 as builder

WORKDIR /app

# Install dependencies
COPY bun.lockb package.json ./
RUN bun install --frozen-lockfile

# Copy the rest of the code
COPY . .

# Build the app (Next.js with standalone output)
RUN bun run build

# 2. Production Runtime Stage
FROM oven/bun:1.1.13-slim as runner

WORKDIR /app

# Copy the standalone output + static files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

# Start the Next.js app
CMD ["bun", "server.js"]
