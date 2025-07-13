# Multi-stage build for React Vite production
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build for web production
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install serve globally
RUN npm install -g serve

# Create non-root user
RUN addgroup -g 1001 -S morrow && \
    adduser -S -D -H -u 1001 -h /app -s /sbin/nologin -G morrow -g morrow morrow

WORKDIR /app

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Change ownership to non-root user
RUN chown -R morrow:morrow /app

# Switch to non-root user
USER morrow

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Serve the built files
CMD ["serve", "-s", "dist", "-l", "3000"]
