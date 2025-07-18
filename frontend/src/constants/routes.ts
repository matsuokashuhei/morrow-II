/**
 * Application route constants
 * Centralized location for all navigation paths
 */

export const ROUTES = {
  HOME: '/',
  ONBOARDING: '/onboarding',
  EVENTS: '/events',
  EVENT_CREATE: '/events/create',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export type RouteType = (typeof ROUTES)[keyof typeof ROUTES];
