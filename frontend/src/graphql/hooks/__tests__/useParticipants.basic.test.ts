/**
 * Basic unit tests for useParticipants hook
 * Tests the hook structure and basic functionality
 */

describe('useParticipants Hook Structure', () => {
  it('should export useParticipants function', () => {
    const { useParticipants } = require('../useParticipants');
    expect(typeof useParticipants).toBe('function');
  });

  it('should export useParticipant function', () => {
    const { useParticipant } = require('../useParticipants');
    expect(typeof useParticipant).toBe('function');
  });

  it('should export useCreateParticipant function', () => {
    const { useCreateParticipant } = require('../useParticipants');
    expect(typeof useCreateParticipant).toBe('function');
  });

  it('should export useUpdateParticipant function', () => {
    const { useUpdateParticipant } = require('../useParticipants');
    expect(typeof useUpdateParticipant).toBe('function');
  });

  it('should export useDeleteParticipant function', () => {
    const { useDeleteParticipant } = require('../useParticipants');
    expect(typeof useDeleteParticipant).toBe('function');
  });
});

describe('Participant GraphQL Documents', () => {
  it('should export required Participant GraphQL documents', () => {
    const generated = require('../../generated');

    expect(generated.GetParticipantsDocument).toBeDefined();
    expect(generated.GetParticipantDocument).toBeDefined();
    expect(generated.CreateParticipantDocument).toBeDefined();
    expect(generated.UpdateParticipantDocument).toBeDefined();
    expect(generated.DeleteParticipantDocument).toBeDefined();
  });

  it('should export required Participant GraphQL hooks', () => {
    const generated = require('../../generated');

    expect(typeof generated.useGetParticipantsQuery).toBe('function');
    expect(typeof generated.useGetParticipantQuery).toBe('function');
    expect(typeof generated.useCreateParticipantMutation).toBe('function');
    expect(typeof generated.useUpdateParticipantMutation).toBe('function');
    expect(typeof generated.useDeleteParticipantMutation).toBe('function');
  });
});
