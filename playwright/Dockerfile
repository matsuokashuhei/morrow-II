# Playwright E2E Testing Environment
FROM mcr.microsoft.com/playwright:v1.54.1-jammy

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy test files
COPY . .

# Install browsers and dependencies with improved error handling
RUN npx playwright install --with-deps chromium || (echo "Primary browser installation failed, attempting recovery..." && npx playwright install chromium)
RUN npx playwright install-deps || echo "Some dependencies may not have installed correctly"

# Verify installation
RUN npx playwright --version

# Default command
CMD ["npm", "test"]
