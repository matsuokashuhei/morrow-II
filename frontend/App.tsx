import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <header className="bg-orange-600 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold">Morrow</h1>
              <nav>
                <ul className="flex space-x-4">
                  <li>
                    <a href="/" className="hover:text-orange-200 transition-colors">
                      ホーム
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}
