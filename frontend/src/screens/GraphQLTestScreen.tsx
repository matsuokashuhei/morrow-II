import React from 'react';
import { useEvents, useUsers } from '../graphql/hooks';
import { Loading } from '../components/ui/Loading';
import { Card } from '../components/ui/Card';
import { DataListSection } from '../components/DataListSection';
import { getGraphQLEndpoint } from '../utils/environment';

export const GraphQLTestScreen: React.FC = () => {
  const { events, loading: eventsLoading, error: eventsError } = useEvents();
  const { users, loading: usersLoading, error: usersError } = useUsers();

  if (eventsLoading || usersLoading) {
    return (
      <div data-testid="graphql-loading">
        <Loading size="lg" text="Loading GraphQL data..." />
      </div>
    );
  }

  return (
    <div data-testid="graphql-test-screen" className="space-y-6">
      <div className="mb-8">
        <h1
          data-testid="page-title"
          className="text-3xl font-bold text-gray-900"
        >
          GraphQL Test
        </h1>
        <p data-testid="page-description" className="text-gray-600 mt-2">
          Testing GraphQL client integration with Apollo Client
        </p>
      </div>

      <div
        data-testid="data-sections"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Users Section */}
        <DataListSection
          data-testid="users-section"
          title="Users"
          data={users}
          error={usersError}
          renderItem={user => (
            <>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-600">{user.email}</div>
            </>
          )}
        />

        {/* Events Section */}
        <DataListSection
          data-testid="events-section"
          title="Events"
          data={events}
          error={eventsError}
          renderItem={event => (
            <>
              <div className="font-medium flex items-center">
                {event.emoji && <span className="mr-2">{event.emoji}</span>}
                {event.title}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {event.description}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(event.startTime).toLocaleDateString()} -{' '}
                {new Date(event.endTime).toLocaleDateString()}
              </div>
            </>
          )}
        />
      </div>

      {/* Connection Status */}
      <Card data-testid="connection-status" className="p-4">
        <h3 className="text-lg font-medium mb-2">Connection Status</h3>
        <div className="flex items-center space-x-4 text-sm">
          <span className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                eventsError || usersError ? 'bg-red-400' : 'bg-green-400'
              }`}
            ></div>
            {eventsError || usersError
              ? 'Disconnected (切断)'
              : 'Connected (接続)'}
          </span>
          <span className="text-gray-600">
            Endpoint: {getGraphQLEndpoint()}
          </span>
        </div>
      </Card>
    </div>
  );
};

export default GraphQLTestScreen;
