import React from 'react';
import { useEvents, useUsers } from '../graphql/hooks';
import { Loading } from '../components/ui/Loading';
import { Card } from '../components/ui/Card';
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
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Users</h2>
          {usersError ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-red-800 font-medium">Error loading users:</h3>
              <p className="text-red-600 text-sm mt-1">{usersError.message}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <p className="text-gray-600">No users found</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {users.map(user => (
                <li
                  key={user.id}
                  className="bg-gray-50 rounded-md p-3 border border-gray-200"
                >
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Events Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Events</h2>
          {eventsError ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-red-800 font-medium">
                Error loading events:
              </h3>
              <p className="text-red-600 text-sm mt-1">{eventsError.message}</p>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <p className="text-gray-600">No events found</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {events.map(event => (
                <li
                  key={event.id}
                  className="bg-gray-50 rounded-md p-3 border border-gray-200"
                >
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
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Connection Status */}
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-2">Connection Status</h3>
        <div className="flex items-center space-x-4 text-sm">
          <span className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            GraphQL API Connected
          </span>
          <span className="text-gray-600">Endpoint: {GRAPHQL_ENDPOINT}</span>
        </div>
      </Card>
    </div>
  );
};

export default GraphQLTestScreen;
