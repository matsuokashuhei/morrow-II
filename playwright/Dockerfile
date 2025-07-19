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

# Install browsers and dependencies
RUN npx playwright install
RUN npx playwright install-deps

# Default command
CMD ["npm", "test"]
