import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EventCreationForm } from '../components/forms';

const EventCreationScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Navigate back to home screen after successful event creation
    navigate('/', { replace: true });
  };

  const handleCancel = () => {
    // Navigate back to events list or home page
    navigate('/events', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              data-testid="back-btn"
              onClick={handleCancel}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              戻る
            </button>
            <h1
              data-testid="page-title"
              className="text-lg font-semibold text-gray-900"
            >
              新しいイベント
            </h1>
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EventCreationForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </main>
    </div>
  );
};

export default EventCreationScreen;
