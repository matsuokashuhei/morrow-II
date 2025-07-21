# Playwright E2E Testing Environment
FROM mcr.microsoft.com/playwright:v1.54.1-jammy

# Set working directory
WORKDIR /app

# Ensure development dependencies are installed in CI
ENV NODE_ENV=development

# Copy package files first for better caching
COPY package.json package-lock.json* ./

# Install dependencies
# Prioritize using package-lock.json for reproducible builds
RUN if [ -f package-lock.json ]; then \
        echo "Installing dependencies with npm ci"; \
        npm ci --include=dev; \
    else \
        echo "No package-lock.json found, using npm install"; \
        npm install --include=dev; \
    fi

# Verify @playwright/test is installed
RUN npm ls @playwright/test || (echo "ERROR: @playwright/test not found" && exit 1)

# Create a script to ensure dependencies are available at runtime
RUN echo '#!/bin/bash\nset -e\nif [ ! -d "/app/node_modules/@playwright/test" ]; then\n  echo "Dependencies not found, installing..."\n  npm ci --include=dev\nfi\nexec "$@"' > /app/entrypoint.sh && chmod +x /app/entrypoint.sh

# Install browsers and dependencies
RUN npx playwright install --with-deps chromium || (echo "Browser installation failed" && exit 1)
RUN npx playwright install-deps || (echo "Dependencies installation failed" && exit 1)

# Verify Playwright installation
RUN npx playwright --version

# Copy test files (will be overridden by volume in development)
COPY . .

# Use entrypoint to ensure dependencies are available
ENTRYPOINT ["/app/entrypoint.sh"]

# Default command
CMD ["npm", "test"]
