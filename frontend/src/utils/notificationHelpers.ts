/**
 * Notification helper utilities for consistent user feedback
 */
import { NotificationType } from '../contexts/NotificationContext';

/**
 * Type for the addNotification function
 */
type AddNotificationFunction = (notification: {
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}) => void;

/**
 * Helper function to show feature coming soon notifications
 */
export const createFeatureComingSoonNotification = (
  addNotification: AddNotificationFunction
) => {
  return (
    message: string,
    title: string = '機能準備中',
    type: NotificationType = 'info'
  ) => {
    addNotification({
      type,
      title,
      message,
    });
  };
};

/**
 * Common notification messages
 */
export const NOTIFICATION_MESSAGES = {
  EDIT_FEATURE_COMING_SOON: '編集機能は現在開発中です。しばらくお待ちください。',
  DELETE_FEATURE_COMING_SOON: '削除機能は現在開発中です。しばらくお待ちください。',
  SHARE_FEATURE_COMING_SOON: '共有機能は次期バージョンで実装予定です。',
} as const;

/**
 * Pre-configured notification helpers for common features
 */
export const createCommonNotifications = (
  addNotification: AddNotificationFunction
) => {
  const showFeatureComingSoon = createFeatureComingSoonNotification(addNotification);

  return {
    showFeatureComingSoon,
    showEditFeatureComingSoon: () => 
      showFeatureComingSoon(NOTIFICATION_MESSAGES.EDIT_FEATURE_COMING_SOON),
    showDeleteFeatureComingSoon: () => 
      showFeatureComingSoon(NOTIFICATION_MESSAGES.DELETE_FEATURE_COMING_SOON),
    showShareFeatureComingSoon: () => 
      showFeatureComingSoon(NOTIFICATION_MESSAGES.SHARE_FEATURE_COMING_SOON),
  };
};
