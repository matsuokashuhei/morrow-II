import { Event } from '../store';

/**
 * GraphQL Event type (matches the schema)
 */
export interface GraphQLEvent {
  id: string;
  title: string;
  description?: string | null;
  startTime: string;
  endTime: string;
  emoji?: string | null;
  visibility: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Converts a GraphQL event to the local Event type
 * @param graphqlEvent - The GraphQL event to convert
 * @returns Converted Event object
 */
export const convertGraphQLEvent = (graphqlEvent: GraphQLEvent): Event => {
  return {
    id: graphqlEvent.id,
    title: graphqlEvent.title,
    description: graphqlEvent.description || '',
    date: graphqlEvent.startTime,
    endTime: graphqlEvent.endTime,
    emoji: graphqlEvent.emoji || '',
    visibility: graphqlEvent.visibility || 'private',
    createdAt: graphqlEvent.createdAt,
    updatedAt: graphqlEvent.updatedAt,
  };
};

/**
 * Converts an array of GraphQL events to local Event types
 * @param graphqlEvents - Array of GraphQL events to convert
 * @returns Array of converted Event objects
 */
export const convertGraphQLEvents = (
  graphqlEvents: GraphQLEvent[]
): Event[] => {
  return graphqlEvents.map(convertGraphQLEvent);
};

/**
 * Filters events by search term
 * @param events - Array of events to filter
 * @param searchTerm - Search term to filter by
 * @returns Filtered events array
 */
export const filterEventsBySearch = (
  events: Event[],
  searchTerm: string
): Event[] => {
  if (!searchTerm.trim()) return events;

  const searchLower = searchTerm.toLowerCase();
  return events.filter(
    event =>
      event.title.toLowerCase().includes(searchLower) ||
      (event.description?.toLowerCase().includes(searchLower) ?? false)
  );
};

/**
 * Filters events by type (upcoming/ended)
 * @param events - Array of events to filter
 * @param filterType - Type of filter to apply
 * @returns Filtered events array
 */
export const filterEventsByType = (
  events: Event[],
  filterType: 'all' | 'upcoming' | 'ended'
): Event[] => {
  if (filterType === 'all') return events;

  const now = new Date();
  return events.filter(event => {
    const eventDate = new Date(event.date);
    if (filterType === 'upcoming') {
      return eventDate > now;
    } else if (filterType === 'ended') {
      return eventDate <= now;
    }
    return true;
  });
};

/**
 * Sorts events by date (upcoming first)
 * @param events - Array of events to sort
 * @returns Sorted events array
 */
export const sortEventsByDate = (events: Event[]): Event[] => {
  return [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

/**
 * Applies all filters and sorting to events
 * @param events - Array of events to process
 * @param searchTerm - Search term to filter by
 * @param filterType - Type of filter to apply
 * @returns Processed events array
 */
export const processEvents = (
  events: Event[],
  searchTerm: string,
  filterType: 'all' | 'upcoming' | 'ended'
): Event[] => {
  let processed = filterEventsBySearch(events, searchTerm);
  processed = filterEventsByType(processed, filterType);
  return sortEventsByDate(processed);
};
