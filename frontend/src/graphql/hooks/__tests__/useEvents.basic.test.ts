/**
 * Basic unit tests for useEvents hook
 * Tests the hook structure and basic functionality
 */

describe('useEvents Hook Structure', () => {
  it('should export useEvents function', () => {
    const { useEvents } = require('../useEvents');
    expect(typeof useEvents).toBe('function');
  });

  it('should export useEvent function', () => {
    const { useEvent } = require('../useEvents');
    expect(typeof useEvent).toBe('function');
  });

  it('should export useCreateEvent function', () => {
    const { useCreateEvent } = require('../useEvents');
    expect(typeof useCreateEvent).toBe('function');
  });

  it('should export useUpdateEvent function', () => {
    const { useUpdateEvent } = require('../useEvents');
    expect(typeof useUpdateEvent).toBe('function');
  });

  it('should export useDeleteEvent function', () => {
    const { useDeleteEvent } = require('../useEvents');
    expect(typeof useDeleteEvent).toBe('function');
  });
});

describe('GraphQL Generated Types', () => {
  it('should export required GraphQL documents', () => {
    const generated = require('../../generated');

    expect(generated.GetEventsDocument).toBeDefined();
    expect(generated.GetEventDocument).toBeDefined();
    expect(generated.CreateEventDocument).toBeDefined();
    expect(generated.UpdateEventDocument).toBeDefined();
    expect(generated.DeleteEventDocument).toBeDefined();
  });

  it('should export required GraphQL hooks', () => {
    const generated = require('../../generated');

    expect(typeof generated.useGetEventsQuery).toBe('function');
    expect(typeof generated.useGetEventQuery).toBe('function');
    expect(typeof generated.useCreateEventMutation).toBe('function');
    expect(typeof generated.useUpdateEventMutation).toBe('function');
    expect(typeof generated.useDeleteEventMutation).toBe('function');
  });
});
