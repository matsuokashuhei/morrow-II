# Morrow E2E Tests

End-to-end testing suite for the Morrow application using Playwright.

## Overview

This directory contains all E2E tests for the Morrow application, completely separated from the frontend development environment.

## Setup

The E2E tests run in a dedicated Docker container with all necessary dependencies pre-installed.

### Prerequisites

- Docker and Docker Compose
- Morrow application services running (postgres, backend, frontend)

## Running Tests

### Basic Commands

```bash
# Run all tests
docker compose --profile tools run --rm playwright npm test

# Run tests with UI mode
docker compose --profile tools run --rm playwright npm run test:ui

# Run specific test file
docker compose --profile tools run --rm playwright npm run test:connectivity

# Run tests in headed mode (for debugging)
docker compose --profile tools run --rm playwright npm run test:headed

# Generate and view HTML report
docker compose --profile tools run --rm playwright npm run report
```

### Browser-specific Tests

```bash
# Run tests on Chromium only
docker compose --profile tools run --rm playwright npm run test:chromium

# Run tests on Firefox only
docker compose --profile tools run --rm playwright npm run test:firefox

# Run tests on WebKit only
docker compose --profile tools run --rm playwright npm run test:webkit

# Run tests on mobile browsers
docker compose --profile tools run --rm playwright npm run test:mobile
```

## Test Structure

```
playwright/
├── tests/               # Test files
│   ├── connectivity.spec.ts
│   ├── home.spec.ts
│   ├── onboarding.spec.ts
│   └── event-creation.spec.ts
├── fixtures/            # Test data and fixtures
├── utils/               # Helper functions and utilities
├── reports/             # Test reports and artifacts
└── playwright.config.ts # Playwright configuration
```

## Test Categories

1. **Connectivity Tests** (`connectivity.spec.ts`)
   - Frontend accessibility
   - Backend API connectivity
   - React application health

2. **Home Screen Tests** (`home.spec.ts`)
   - Landing page functionality
   - Navigation components
   - User interface elements

3. **Onboarding Tests** (`onboarding.spec.ts`)
   - User registration flow
   - Welcome screens
   - Initial setup process

4. **Event Creation Tests** (`event-creation.spec.ts`)
   - Event creation forms
   - Data validation
   - Success/error flows

## Configuration

The Playwright configuration supports:

- Multiple browsers (Chromium, Firefox, WebKit)
- Mobile device simulation
- Screenshot and video recording on failures
- HTML/JUnit/JSON reporting
- Trace collection for debugging

## Development

### Adding New Tests

1. Create a new `.spec.ts` file in the `tests/` directory
2. Use the existing test patterns and utilities
3. Add appropriate test data to `fixtures/` if needed
4. Update this README if adding new test categories

### Debugging Tests

```bash
# Run in debug mode
docker compose --profile tools run --rm playwright npm run test:debug

# Run with browser UI visible
docker compose --profile tools run --rm playwright npm run test:headed
```

## CI/CD Integration

The tests are configured to run in CI environments with:

- Increased retry attempts
- Single worker for stability
- Comprehensive reporting

## Dependencies

- `@playwright/test`: Core testing framework
- `@types/node`: Node.js type definitions

All browser dependencies are managed by the Playwright Docker image.
