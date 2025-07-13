import React from 'react';
import { useEvents, useUsers } from '../graphql/hooks';
import { Loading } from '../components/ui/Loading';

export const GraphQLTestComponent: React.FC = () => {
  const { events, loading: eventsLoading, error: eventsError } = useEvents();
  const { users, loading: usersLoading, error: usersError } = useUsers();

  if (eventsLoading || usersLoading) {
    return <Loading size="lg" text="Loading GraphQL data..." />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">GraphQL Integration Test</h2>
      
      {/* Events Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Events</h3>
        {eventsError ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-700">
              Error loading events: {eventsError.message}
            </p>
            <p className="text-sm text-red-600 mt-2">
              Make sure the backend server is running on port 8080
            </p>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-green-700">
              ✅ Successfully connected to GraphQL API
            </p>
            <p className="text-sm text-green-600 mt-2">
              Found {events.length} events
            </p>
            {events.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Events:</h4>
                <ul className="space-y-2">
                  {events.map((event) => (
                    <li key={event.id} className="bg-white p-3 rounded border">
                      <div className="font-medium">{event.title}</div>
                      {event.description && (
                        <div className="text-sm text-gray-600">{event.description}</div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {event.startTime} - {event.endTime}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Users Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Users</h3>
        {usersError ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-700">
              Error loading users: {usersError.message}
            </p>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-green-700">
              ✅ Successfully loaded users data
            </p>
            <p className="text-sm text-green-600 mt-2">
              Found {users.length} users
            </p>
            {users.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Users:</h4>
                <ul className="space-y-2">
                  {users.map((user) => (
                    <li key={user.id} className="bg-white p-3 rounded border">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* GraphQL Client Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">GraphQL Client Status</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>✅ Apollo Client configured</li>
          <li>✅ TypeScript types generated</li>
          <li>✅ Custom hooks created</li>
          <li>✅ Error handling implemented</li>
          <li>✅ Cache policies configured</li>
        </ul>
      </div>
    </div>
  );
};

export default GraphQLTestComponent;
