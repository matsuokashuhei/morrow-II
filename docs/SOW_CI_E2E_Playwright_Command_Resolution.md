# SOW - CI E2E Playwright Command Not Found Resolution

## Issue Identification
**Created:** 2025-01-21
**Type:** CI/CD E2E Test Failure
**Priority:** Critical
**Workflow Run:** #127

### Issue Description
GitHub Actions e2e-test job failing with `playwright: not found` error despite successful Playwright Docker container build and dependency installation. The issue occurs when npm scripts execute `playwright` command directly instead of using `npx`.

### Error Analysis
```
> morrow-e2e-tests@1.0.0 test:connectivity
> playwright test tests/connectivity.spec.ts

sh: 1: playwright: not found
```

**Root Cause:** Package.json scripts using `playwright` instead of `npx playwright`, causing shell to fail finding the binary in `$PATH` within Docker container environment.

## Problem Analysis

### Affected Components
- **E2E Testing Pipeline**: GitHub Actions e2e-test job
- **Playwright Configuration**: Command execution within Docker container
- **NPM Scripts**: All Playwright-related scripts in package.json

### Environment Context
- **CI Platform**: GitHub Actions ubuntu-latest
- **Container**: Custom Playwright Docker image built from mcr.microsoft.com/playwright:v1.54.1-jammy
- **Dependencies**: Playwright 1.54.1 successfully installed via npm install
- **Network**: All services (backend, frontend, postgres) healthy and responding

### Service Status Analysis
✅ **Backend Service**: Healthy (accessible on port 8080)
✅ **Frontend Service**: Healthy (accessible on port 3000)
✅ **PostgreSQL Service**: Healthy (initialized and accepting connections)
✅ **Playwright Container**: Built successfully with dependencies installed
❌ **Playwright Tests**: Command not found error in execution

## Resolution Strategy

### Technical Fix
Updated all npm scripts in `playwright/package.json` to use `npx playwright` instead of `playwright` directly to ensure proper binary resolution within Docker container environment.

### Implementation Details
**File:** `playwright/package.json`
**Changes:**
- Updated 12 test-related scripts to use `npx playwright`
- Maintained all existing script functionality and parameters
- Applied consistent `npx` prefix across all Playwright commands

**Before:**
```json
"test:connectivity": "playwright test tests/connectivity.spec.ts"
```

**After:**
```json
"test:connectivity": "npx playwright test tests/connectivity.spec.ts"
```

### Validation Plan
1. **Local Testing**: Verify Playwright commands work with `npx` prefix in Docker container
2. **CI Validation**: Monitor next workflow run for e2e-test job success
3. **Smoke Testing**: Ensure connectivity tests execute successfully in CI environment

## Expected Outcomes

### Immediate Goals
- E2E test job passes in CI pipeline
- Playwright connectivity tests execute successfully
- All service connectivity validated (backend, frontend, GraphQL)

### Success Metrics
- E2E-test job status: PASS
- Test execution time: < 2 minutes
- All connectivity assertions: 6/6 passing
- CI pipeline completion: All 4 jobs successful

### Dependencies Resolution
This fix addresses the final blocking issue for complete CI pipeline success:
- ✅ Frontend tests (EventCard timer mocks) - Previously resolved
- ✅ Playwright Docker setup - Previously resolved
- 🔄 E2E test execution - Current fix implementation
- ⏳ Complete CI pipeline success - Pending validation

## Next Steps
1. ✅ Commit and push the package.json changes
2. 🔄 Monitor workflow run #129 for e2e-test job results
3. ⏳ If successful, complete iterative CI fixing process
4. ⏳ If additional issues arise, continue debugging and create new SOW documentation

## Monitoring Progress
**Workflow Run #129**: Currently in progress
- **Status**: In Progress (started 2025-07-21T03:06:09Z)
- **Backend-test**: In Progress (setting up containers)
- **Frontend-test**: In Progress (building Docker image)
- **E2E-test**: Pending (waiting for prerequisites)
- **Docker-build**: Pending (waiting for prerequisites)

## Historical Context
This issue represents the third iteration of CI fixes:
- **Run #125**: Fixed EventCard Jest timer synchronization issues
- **Run #126**: Fixed Playwright Docker image configuration
- **Run #127**: Identified Playwright command resolution issue
- **Run #128**: Current fix for npx command execution
