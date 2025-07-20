import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './src/components/ui/Navigation';
import { Loading } from './src/components/ui/Loading';
import { ROUTES } from './src/constants/routes';
import { NotificationProvider } from './src/contexts/NotificationContext';
import { NotificationContainer } from './src/components/ui/NotificationContainer';

// Lazy load route components for better performance
const HomeScreen = React.lazy(() => import('./src/screens/HomeScreen'));
const OnboardingScreen = React.lazy(
  () => import('./src/screens/OnboardingScreen')
);
const GraphQLTestScreen = React.lazy(
  () => import('./src/screens/GraphQLTestScreen')
);
const EventCreationScreen = React.lazy(
  () => import('./src/screens/EventCreationScreen')
);
const EventListScreen = React.lazy(
  () => import('./src/screens/EventListScreen')
);
const EventDetailScreen = React.lazy(
  () => import('./src/screens/EventDetailScreen')
);

export default function App() {
  const navigationItems = [
    { label: 'ホーム', to: ROUTES.HOME, active: true },
    { label: 'イベント一覧', to: ROUTES.EVENTS, active: false },
    { label: 'GraphQL Test', to: '/graphql-test', active: false },
  ];

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50">
        <Router
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <header className="bg-orange-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="text-2xl font-bold">Morrow</div>
                <Navigation items={navigationItems} />
                <Navigation items={navigationItems} mobile />
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Suspense fallback={<Loading size="lg" text="Loading..." />}>
              <Routes>
                <Route path={ROUTES.HOME} element={<HomeScreen />} />
                <Route
                  path={ROUTES.ONBOARDING}
                  element={<OnboardingScreen />}
                />
                <Route path={ROUTES.EVENTS} element={<EventListScreen />} />
                <Route path="/events/:id" element={<EventDetailScreen />} />
                <Route
                  path={ROUTES.EVENT_CREATE}
                  element={<EventCreationScreen />}
                />
                <Route path="/graphql-test" element={<GraphQLTestScreen />} />
              </Routes>
            </Suspense>
          </main>
          <NotificationContainer />
        </Router>
      </div>
    </NotificationProvider>
  );
}
