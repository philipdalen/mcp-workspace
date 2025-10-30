# Teamwork MCP Community Server - Standalone Dockerfile
# This Dockerfile builds the server from source for standalone use

FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first (for better layer caching)
COPY package*.json ./
COPY tsconfig.json ./
COPY prepend-shebang.cjs ./

# Install ALL dependencies (including dev dependencies for building)
RUN npm ci --ignore-scripts

# Copy all source files
COPY src/ ./src/

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production --ignore-scripts

# Copy built application from builder
COPY --from=builder /app/build ./build

# Create non-root user
RUN addgroup -S mcpuser && \
    adduser -S mcpuser -G mcpuser && \
    chown -R mcpuser:mcpuser /app

USER mcpuser

# Expose port (if needed for debugging, not required for STDIO mode)
# EXPOSE 3000

# Run the MCP server
CMD ["node", "build/index.js"]


