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

# Install browsers and dependencies with error handling
RUN npx playwright install --with-deps || (echo "Browser installation failed" && exit 1)
RUN npx playwright install-deps

# Default command
CMD ["npm", "test"]
