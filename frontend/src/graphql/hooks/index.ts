// Re-export all custom hooks for easy importing
export * from './useUsers';
export * from './useEvents';
export * from './useParticipants';

// Re-export types from generated file
export type {
  User,
  Event,
  Participant,
  EventVisibility,
  ParticipantRole,
  ParticipantStatus,
  CreateUserInput,
  UpdateUserInput,
  CreateEventInput,
  UpdateEventInput,
  CreateParticipantInput,
  UpdateParticipantInput,
} from '../generated';
