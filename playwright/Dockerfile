# Playwright E2E Testing Environment
FROM mcr.microsoft.com/playwright:v1.54.1-jammy

# Set working directory
WORKDIR /app

# Ensure development dependencies are installed in CI
ENV NODE_ENV=development

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for CI)
RUN npm ci --include=dev 2>/dev/null || npm install --production=false

# Copy test files
COPY . .

# Install browsers and dependencies with improved error handling
RUN npx playwright install --with-deps chromium || (echo "Primary browser installation failed, attempting recovery..." && npx playwright install chromium)
RUN npx playwright install-deps || echo "Some dependencies may not have installed correctly"

# Verify installation
RUN npx playwright --version

# Default command
CMD ["npm", "test"]
