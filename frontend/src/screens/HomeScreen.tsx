import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { EventCard } from '../components/EventCard';
import { useEventStore, useUIStore } from '../store';

const HomeScreen = () => {
  const { events, addEvent, deleteEvent, isLoading, error } = useEventStore();

  const { isCreateEventModalOpen, setCreateEventModalOpen } = useUIStore();

  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  const handleCreateEvent = () => {
    if (!eventTitle || !eventDate) return;

    addEvent({
      title: eventTitle,
      date: eventDate,
      description: eventDescription,
    });

    setCreateEventModalOpen(false);
    // Reset form
    setEventTitle('');
    setEventDate('');
    setEventDescription('');
  };

  const handleDeleteEvent = (eventToDelete: any) => {
    if (window.confirm('このイベントを削除してもよろしいですか？')) {
      deleteEvent(eventToDelete.id);
    }
  };

  const handleShareEvent = (eventToShare: any) => {
    // TODO: Implement sharing functionality
    const shareText = `${eventToShare.title} - ${new Date(eventToShare.date).toLocaleDateString('ja-JP')}`;

    if (navigator.share) {
      navigator.share({
        title: eventToShare.title,
        text: shareText,
        url: window.location.href,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${shareText} - ${window.location.href}`);
      alert('イベント情報をクリップボードにコピーしました！');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Morrow!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Event Countdown Sharing App
        </p>

        {events.length === 0 && (
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Create, manage, and share your upcoming events with friends and
              family.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card padding="md">
                <div className="text-orange-600 text-3xl mb-4">📅</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  イベント作成
                </h3>
                <p className="text-gray-600">
                  大切な日程を簡単に登録してカウントダウンを開始
                </p>
              </Card>

              <Card padding="md">
                <div className="text-orange-600 text-3xl mb-4">⏰</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  リアルタイム表示
                </h3>
                <p className="text-gray-600">
                  残り時間を美しくリアルタイムでカウントダウン
                </p>
              </Card>

              <Card padding="md">
                <div className="text-orange-600 text-3xl mb-4">👥</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  友達と共有
                </h3>
                <p className="text-gray-600">
                  友人や家族と一緒にイベントを楽しみに待つ
                </p>
              </Card>
            </div>
          </div>
        )}

        <div className="mt-12 space-y-4">
          <Button
            size="lg"
            onClick={() => setCreateEventModalOpen(true)}
            loading={isLoading}
          >
            イベントを作成
          </Button>

          {events.length === 0 && (
            <div>
              <Button
                variant="secondary"
                size="md"
                onClick={() => (window.location.href = '/onboarding')}
              >
                使い方を見る
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Events List */}
      {events.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              あなたのイベント ({events.length})
            </h2>
            <Button
              onClick={() => setCreateEventModalOpen(true)}
              loading={isLoading}
            >
              新しいイベント
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onDelete={handleDeleteEvent}
                onShare={handleShareEvent}
              />
            ))}
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      <Modal
        isOpen={isCreateEventModalOpen}
        onClose={() => setCreateEventModalOpen(false)}
        title="新しいイベントを作成"
        size="md"
      >
        <div className="space-y-6">
          <Input
            label="イベント名"
            placeholder="例: 誕生日パーティー"
            value={eventTitle}
            onChange={e => setEventTitle(e.target.value)}
            required
          />

          <Input
            label="イベント日時"
            type="datetime-local"
            value={eventDate}
            onChange={e => setEventDate(e.target.value)}
            required
          />

          <Input
            label="説明（任意）"
            placeholder="イベントの詳細を入力してください"
            value={eventDescription}
            onChange={e => setEventDescription(e.target.value)}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setCreateEventModalOpen(false)}
            >
              キャンセル
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateEvent}
              disabled={!eventTitle || !eventDate}
              loading={isLoading}
            >
              作成
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HomeScreen;
