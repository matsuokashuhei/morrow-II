# Playwright E2E Testing Environment
FROM mcr.microsoft.com/playwright:v1.54.1-jammy

# Set working directory
WORKDIR /app

# Ensure development dependencies are installed in CI
ENV NODE_ENV=development

# Copy package files and package-lock.json specifically
COPY package.json ./
COPY package-lock.json ./

# Install dependencies (including dev dependencies for CI)
# Use npm install if ci fails (for environments without package-lock.json)
RUN npm ci --include=dev || npm install --include=dev

# Debug: List installed packages
RUN npm list --depth=0 || true
RUN ls -la node_modules/ | head -20 || true

# Copy test files
COPY . .

# Install browsers and dependencies with improved error handling
RUN npx playwright install --with-deps chromium || (echo "Primary browser installation failed, attempting recovery..." && npx playwright install chromium)
RUN npx playwright install-deps || echo "Some dependencies may not have installed correctly"

# Verify installation
RUN npx playwright --version

# Default command
CMD ["npm", "test"]
