import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './src/components/ui/Navigation';
import { Loading } from './src/components/ui/Loading';

// Lazy load route components for better performance
const HomeScreen = React.lazy(() => import('./src/screens/HomeScreen'));
const OnboardingScreen = React.lazy(
  () => import('./src/screens/OnboardingScreen')
);

export default function App() {
  const navigationItems = [
    { label: 'ホーム', href: '/', active: true },
    { label: '使い方', href: '/onboarding' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <header className="bg-orange-600 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold">Morrow</h1>
              <Navigation items={navigationItems} />
              <Navigation items={navigationItems} mobile />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<Loading size="lg" text="Loading..." />}>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/onboarding" element={<OnboardingScreen />} />
            </Routes>
          </Suspense>
        </main>
      </Router>
    </div>
  );
}
