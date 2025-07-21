# Statement of Work (SOW): CI Frontend Test Failures Resolution

## Project Information
- **Repository**: morrow-II (Event Countdown Sharing App)
- **Pull Request**: #29 - feature/issue-17-event-list-detail
- **Priority**: HIGH (Blocking CI pipeline after previous TypeScript/Prettier fixes)
- **Created**: July 21, 2025
- **Previous Issues**: ✅ TypeScript compilation errors (RESOLVED), ✅ Prettier formatting (RESOLVED)

## Current Status: NEW TEST FAILURES ❌

**Previous Successes**: 
- ✅ TypeScript compilation: PASSED
- ✅ ESLint linting: PASSED  
- ✅ Prettier formatting: PASSED
- ✅ Backend tests: PASSED completely

**Current Failure**: 
- ❌ Frontend tests: FAILED in EventCard.test.tsx

## Problem Analysis

### Test Failure Details
**File**: `frontend/src/__tests__/components/EventCard.test.tsx`  
**Failing Test**: "updates countdown every second"  
**Line**: 71  
**Error**: `expect(screen.getByText('残り時間')).toBeInTheDocument()`

**Expected Behavior**: Test should find "残り時間" (remaining time) text  
**Actual Behavior**: Component renders "このイベントは終了しました" (this event has ended)

### Root Cause Analysis
The test is checking that after advancing fake timers by 1 second, the countdown component still displays the "残り時間" text. However, the component is instead showing the expired event message.

**Possible Issues**:
1. **Timer Mock Issue**: `jest.advanceTimersByTime(1000)` may not be properly syncing with component's `useEffect` timer
2. **Date Calculation Issue**: Component's `calculateTimeRemaining` function may have edge case with fake timers
3. **State Update Timing**: React state updates may not be happening synchronously with timer advancement

### Mock Data Context
- Mock current time: `2025-07-13T10:00:00Z`
- Mock event date: `2025-07-20T15:00:00Z` (7 days, 5 hours in future)
- Expected: Event should remain "active" after 1-second advance
- Actual: Event appears to be "expired"

## Technical Solution Strategy

### Phase 1: Investigate Timer Behavior
1. **Check Component Timer Logic**: Examine how `EventCard` component handles timer updates
2. **Verify Mock Synchronization**: Ensure `jest.advanceTimersByTime` properly triggers component re-renders
3. **Debug Date Calculations**: Validate `calculateTimeRemaining` function with fake timer context

### Phase 2: Fix Test Implementation
1. **Option A**: Modify test to properly handle async state updates with `act()` wrapper
2. **Option B**: Adjust timer advancement to ensure component state updates correctly
3. **Option C**: Mock Date.now() directly in component if needed

### Phase 3: Validate Solution
1. **Local Testing**: Run `npm test EventCard.test.tsx` to verify fix
2. **Full Test Suite**: Ensure no regressions in other tests
3. **CI Validation**: Push changes and confirm all CI jobs pass

## Implementation Plan

### Step 1: Local Investigation
```bash
# Run specific failing test with verbose output
docker compose run --rm frontend npm test -- --testPathPattern=EventCard.test.tsx --verbose

# Run with additional debugging if needed
docker compose run --rm frontend npm test -- --testPathPattern=EventCard.test.tsx --runInBand --detectOpenHandles
```

### Step 2: Code Analysis
- Examine `EventCard.tsx` timer/effect implementation
- Check test setup for proper fake timer configuration
- Verify mock date consistency

### Step 3: Apply Fix
Based on investigation, implement one of:
- Fix timer/state synchronization in test
- Adjust component to better handle fake timers
- Update test expectations to match actual behavior

### Step 4: Validation
- Local test validation
- Full frontend test suite run
- CI pipeline validation

## Success Criteria

✅ **Primary Goal**: EventCard.test.tsx "updates countdown every second" test passes  
✅ **Secondary Goal**: All other tests continue to pass (no regressions)  
✅ **Tertiary Goal**: Complete CI pipeline passes (all 4 jobs: backend-test, frontend-test, e2e-test, docker-build)  

## Risk Assessment

**Low Risk**: Issue is isolated to specific test case  
**Medium Risk**: Timer-related fixes might affect other time-dependent tests  
**Mitigation**: Thorough local testing before CI submission  

## Timeline

- **Investigation**: 15-30 minutes
- **Implementation**: 15-30 minutes  
- **Testing & Validation**: 15-30 minutes
- **Total Estimated**: 45-90 minutes

## Dependencies

- Jest fake timers functionality
- React Testing Library act() utilities
- Component timer/effect implementation
- No external service dependencies

---

**Next Action**: Begin local investigation of EventCard test timer behavior
