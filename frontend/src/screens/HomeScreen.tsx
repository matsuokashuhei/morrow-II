import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EventCard } from '../components/EventCard';
import { useEventStore, Event } from '../store';
import { ROUTES } from '../constants/routes';

const HomeScreen = () => {
  const navigate = useNavigate();
  const { events, deleteEvent, isLoading, error } = useEventStore();

  const handleDeleteEvent = (eventToDelete: Event) => {
    if (window.confirm('このイベントを削除してもよろしいですか？')) {
      deleteEvent(eventToDelete.id);
    }
  };

  const handleShareEvent = (eventToShare: Event) => {
    // TODO: Implement sharing functionality
    const shareText = `${eventToShare.title} - ${new Date(eventToShare.date).toLocaleDateString('ja-JP')}`;
    const currentUrl = window.location.origin + window.location.pathname;

    if (navigator.share) {
      navigator.share({
        title: eventToShare.title,
        text: shareText,
        url: currentUrl,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${shareText} - ${currentUrl}`);
      alert('イベント情報をクリップボードにコピーしました！');
    }
  };

  return (
    <div className="responsive-container py-12">
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
            onClick={() => navigate(ROUTES.EVENT_CREATE)}
            loading={isLoading}
          >
            イベントを作成
          </Button>

          {events.length === 0 && (
            <div>
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate(ROUTES.ONBOARDING)}
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
              onClick={() => navigate(ROUTES.EVENT_CREATE)}
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
    </div>
  );
};

export default HomeScreen;
