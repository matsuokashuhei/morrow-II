import { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Event } from '../store';

interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
  onShare?: (event: Event) => void;
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const EventCard = ({ event, onEdit, onDelete, onShare, className }: EventCardProps) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  const calculateTimeRemaining = (targetDate: string): TimeRemaining => {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const difference = target - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      isExpired: false,
    };
  };

  useEffect(() => {
    const updateCountdown = () => {
      setTimeRemaining(calculateTimeRemaining(event.date));
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [event.date]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card padding="md" className={className}>
      <div className="space-y-4">
        {/* Event Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {event.title}
            </h3>
            <p className="text-sm text-gray-500">
              {formatDate(event.date)}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2 ml-4">
            {onShare && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onShare(event)}
                className="p-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                </svg>
              </Button>
            )}
            {onEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(event)}
                className="p-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                </svg>
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(event)}
                className="p-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 102 0v3a1 1 0 11-2 0V9zm4 0a1 1 0 10-2 0v3a1 1 0 102 0V9z" clipRule="evenodd"/>
                </svg>
              </Button>
            )}
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-gray-600">
            {event.description}
          </p>
        )}

        {/* Countdown */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
          {timeRemaining.isExpired ? (
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700 mb-2">🎉 イベント終了</p>
              <p className="text-sm text-gray-500">このイベントは終了しました</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">残り時間</p>
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-white rounded-lg p-2 shadow-sm">
                  <div className="text-lg font-bold text-orange-600">
                    {timeRemaining.days}
                  </div>
                  <div className="text-xs text-gray-500">日</div>
                </div>
                <div className="bg-white rounded-lg p-2 shadow-sm">
                  <div className="text-lg font-bold text-orange-600">
                    {timeRemaining.hours}
                  </div>
                  <div className="text-xs text-gray-500">時間</div>
                </div>
                <div className="bg-white rounded-lg p-2 shadow-sm">
                  <div className="text-lg font-bold text-orange-600">
                    {timeRemaining.minutes}
                  </div>
                  <div className="text-xs text-gray-500">分</div>
                </div>
                <div className="bg-white rounded-lg p-2 shadow-sm">
                  <div className="text-lg font-bold text-orange-600">
                    {timeRemaining.seconds}
                  </div>
                  <div className="text-xs text-gray-500">秒</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export { EventCard };
export type { EventCardProps };
