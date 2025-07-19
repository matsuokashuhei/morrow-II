import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { EventCard } from '../components/EventCard';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';
import { Card } from '../components/ui/Card';
import { ROUTES } from '../constants/routes';
import { useGetEventQuery } from '../graphql/generated';
import { Event } from '../store';

const EventDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, loading, error, refetch } = useGetEventQuery({
    variables: { id: id || '' },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    skip: !id,
  });

  // Convert GraphQL event to local Event type
  const event: Event | null = React.useMemo(() => {
    if (!data?.event) return null;

    return {
      id: data.event.id,
      title: data.event.title,
      description: data.event.description || '',
      date: data.event.startTime,
      endTime: data.event.endTime,
      emoji: data.event.emoji || '',
      visibility: data.event.visibility || 'private',
      createdAt: data.event.createdAt,
      updatedAt: data.event.updatedAt,
    };
  }, [data?.event]);

  const handleEventEdit = (event: Event) => {
    alert('Edit functionality is not yet implemented.');
    console.log('Edit event:', event);
  };

  const handleEventDelete = (event: Event) => {
    alert('Delete functionality is not yet implemented.');
    console.log('Delete event:', event);
  };

  const handleEventShare = (event: Event) => {
    alert('Share functionality is not yet implemented.');
    console.log('Share event:', event);
  };

  // Redirect if no ID provided
  if (!id) {
    return <Navigate to={ROUTES.EVENTS} replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="イベントを読み込み中..." />
      </div>
    );
  }

  if (error || !event) {
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
            イベントが見つかりません
          </h3>
          <p className="text-gray-600 mb-4">
            このイベントは削除されたか、存在しない可能性があります。
          </p>
          <div className="space-x-3">
            <Button onClick={() => refetch()} variant="secondary">
              再試行
            </Button>
            <Link to={ROUTES.EVENTS}>
              <Button variant="primary">イベント一覧に戻る</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link
              to={ROUTES.HOME}
              className="hover:text-gray-700 transition-colors"
            >
              ホーム
            </Link>
          </li>
          <li>
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </li>
          <li>
            <Link
              to={ROUTES.EVENTS}
              className="hover:text-gray-700 transition-colors"
            >
              イベント一覧
            </Link>
          </li>
          <li>
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </li>
          <li className="text-gray-900 font-medium">{event.title}</li>
        </ol>
      </nav>

      {/* Event Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {event.title}
            </h1>
            {event.description && (
              <p className="text-lg text-gray-600">{event.description}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => handleEventShare(event)}
              className="flex items-center space-x-2"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              <span>共有</span>
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleEventEdit(event)}
              className="flex items-center space-x-2"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <span>編集</span>
            </Button>
            <Button
              variant="danger"
              onClick={() => handleEventDelete(event)}
              className="flex items-center space-x-2"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 102 0v3a1 1 0 11-2 0V9zm4 0a1 1 0 10-2 0v3a1 1 0 102 0V9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>削除</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Event Card with Enhanced Countdown */}
      <div className="max-w-2xl mx-auto mb-8">
        <EventCard
          event={event}
          onEdit={handleEventEdit}
          onDelete={handleEventDelete}
          onShare={handleEventShare}
          className="shadow-lg"
        />
      </div>

      {/* Event Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Event Information */}
        <Card padding="lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            イベント情報
          </h3>
          <div className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">開始日時</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(event.date).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">作成日</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(event.createdAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">最終更新</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(event.updatedAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </dd>
            </div>
          </div>
        </Card>

        {/* Future Features Preview */}
        <Card padding="lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            参加者 <span className="text-sm text-gray-500">(Coming Soon)</span>
          </h3>
          <div className="text-center py-8 text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-sm">Phase 2で参加者機能が追加されます</p>
          </div>
        </Card>
      </div>

      {/* Back Button */}
      <div className="mt-8 text-center">
        <Link to={ROUTES.EVENTS}>
          <Button variant="secondary" size="lg">
            ← イベント一覧に戻る
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EventDetailScreen;
