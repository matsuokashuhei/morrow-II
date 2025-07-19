import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EventCard } from '../components/EventCard';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';
import { Card } from '../components/ui/Card';
import { ROUTES } from '../constants/routes';
import { useGetEventsQuery } from '../graphql/generated';
import { Event } from '../store';
import { useNotification } from '../contexts/NotificationContext';

type FilterType = 'all' | 'upcoming' | 'ended';

const EventListScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const { addNotification } = useNotification();

  const { data, loading, error, refetch } = useGetEventsQuery({
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  // Convert GraphQL events to local Event type
  const events = useMemo(() => {
    if (!data?.events) return [];

    return data.events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description || '',
      date: event.startTime,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      endTime: event.endTime,
      emoji: event.emoji || '',
      visibility: event.visibility,
    }));
  }, [data?.events]);

  // Filter and search events
  const filteredEvents = useMemo(() => {
    if (!events) return [];

    let filtered = events;

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        event =>
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      const now = new Date();
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        if (filterType === 'upcoming') {
          return eventDate > now;
        } else if (filterType === 'ended') {
          return eventDate <= now;
        }
        return true;
      });
    }

    // Sort by date (upcoming first)
    return filtered.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [events, searchTerm, filterType]);

  const handleEventEdit = (event: Event) => {
    addNotification({
      type: 'info',
      title: '機能準備中',
      message: '編集機能は現在開発中です。しばらくお待ちください。',
    });
    console.log('Edit event:', event);
  };

  const handleEventDelete = (event: Event) => {
    addNotification({
      type: 'info',
      title: '機能準備中',
      message: '削除機能は現在開発中です。しばらくお待ちください。',
    });
    console.log('Delete event:', event);
  };

  const handleEventShare = (event: Event) => {
    addNotification({
      type: 'info',
      title: '機能準備中',
      message: '共有機能は次期バージョンで実装予定です。',
    });
    console.log('Share event:', event);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="イベントを読み込み中..." />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card padding="lg" className="max-w-md mx-auto text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            エラーが発生しました
          </h3>
          <p className="text-gray-600 mb-4">
            イベントの読み込みに失敗しました。
          </p>
          <Button onClick={() => refetch()} variant="primary">
            再試行
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            イベント一覧
          </h1>
          <p className="text-gray-600">
            あなたのイベントを確認して、カウントダウンを楽しみましょう
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to={ROUTES.EVENT_CREATE}>
            <Button variant="primary" size="lg">
              + 新しいイベント
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <Card padding="md" className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                placeholder="イベントを検索..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
              />
            </div>
          </div>

          {/* Filter */}
          <div className="sm:w-48">
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              value={filterType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterType(e.target.value as FilterType)
              }
            >
              <option value="all">すべて</option>
              <option value="upcoming">開催予定</option>
              <option value="ended">終了済み</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <Card padding="lg" className="text-center">
          {events.length === 0 ? (
            <>
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                まだイベントがありません
              </h3>
              <p className="text-gray-600 mb-4">
                最初のイベントを作成して、カウントダウンを始めましょう！
              </p>
              <Link to={ROUTES.EVENT_CREATE}>
                <Button variant="primary">イベントを作成</Button>
              </Link>
            </>
          ) : (
            <>
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                該当するイベントがありません
              </h3>
              <p className="text-gray-600 mb-4">
                検索条件またはフィルターを変更してください。
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                }}
              >
                フィルターをクリア
              </Button>
            </>
          )}
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map(event => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="block transform transition-transform duration-200 hover:scale-105"
            >
              <EventCard
                event={event}
                onEdit={handleEventEdit}
                onDelete={handleEventDelete}
                onShare={handleEventShare}
                className="h-full"
              />
            </Link>
          ))}
        </div>
      )}

      {/* Results summary */}
      {filteredEvents.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-500">
          {searchTerm || filterType !== 'all'
            ? `${filteredEvents.length} 件のイベントが見つかりました`
            : `合計 ${filteredEvents.length} 件のイベント`}
        </div>
      )}
    </div>
  );
};

export default EventListScreen;
