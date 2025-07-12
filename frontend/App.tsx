import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './src/screens/HomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/" element={<AppLayout />} />
      </Routes>
    </Router>
  );
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-orange-600">Morrow</h1>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <a
                    href="/"
                    className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
                  >
                    ホーム
                  </a>
                </li>
                <li>
                  <a
                    href="/events"
                    className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
                  >
                    イベント
                  </a>
                </li>
                <li>
                  <a
                    href="/profile"
                    className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
                  >
                    プロフィール
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
        </Routes>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Morrow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
