import React from 'react';
import { useEvents, useUsers } from '../graphql/hooks';
import { Loading } from '../components/ui/Loading';
import { Card } from '../components/ui/Card';
import { DataListSection } from '../components/DataListSection';
import { GRAPHQL_ENDPOINT } from '../graphql/constants';

export const GraphQLTestScreen: React.FC = () => {
  const { events, loading: eventsLoading, error: eventsError } = useEvents();
  const { users, loading: usersLoading, error: usersError } = useUsers();

  if (eventsLoading || usersLoading) {
    return <Loading size="lg" text="Loading GraphQL data..." />;
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">GraphQL Test</h1>
        <p className="text-gray-600 mt-2">
          Testing GraphQL client integration with Apollo Client
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Section */}
        <DataListSection
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
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-2">Connection Status</h3>
        <div className="flex items-center space-x-4 text-sm">
          <span className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                eventsError || usersError ? 'bg-red-400' : 'bg-green-400'
              }`}
            ></div>
            {eventsError || usersError
              ? 'GraphQL API Connection Error'
              : 'GraphQL API Connected'}
          </span>
          <span className="text-gray-600">Endpoint: {GRAPHQL_ENDPOINT}</span>
        </div>
      </Card>
    </div>
  );
};

export default GraphQLTestScreen;
