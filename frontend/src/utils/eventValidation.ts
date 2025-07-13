import * as yup from 'yup';
import { EventVisibility } from '../graphql/generated';

export interface EventFormData {
  title: string;
  description: string;
  startTime: string; // ISO string for datetime-local input
  endTime: string; // ISO string for datetime-local input
  emoji: string;
  visibility: EventVisibility;
  creatorId: string;
}

// Helper function to get current date in local timezone for datetime-local input
const getCurrentDateTime = () => {
  const now = new Date();
  // Subtract timezone offset to get local time in ISO format
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localTime.toISOString().slice(0, 16); // Format for datetime-local input
};

export const eventValidationSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required('イベント名は必須です')
    .min(1, '1文字以上入力してください')
    .max(100, '100文字以内で入力してください'),

  description: yup
    .string()
    .max(500, '500文字以内で入力してください')
    .default(''),

  startTime: yup
    .string()
    .required('開始日時は必須です')
    .test(
      'future-date',
      '現在時刻以降を選択してください',
      function (value: string | undefined) {
        if (!value) return false;
        const selectedDate = new Date(value);
        const now = new Date();
        return selectedDate > now;
      }
    ),

  endTime: yup
    .string()
    .required('終了日時は必須です')
    .test(
      'after-start',
      '開始日時以降を選択してください',
      function (value: string | undefined) {
        const { startTime } = this.parent as { startTime: string };
        if (!value || !startTime) return false;
        const endDate = new Date(value);
        const startDate = new Date(startTime);
        return endDate > startDate;
      }
    ),

  emoji: yup
    .string()
    .matches(/^.{0,2}$/, '絵文字は2文字以内で入力してください')
    .default('🎉'),

  visibility: yup
    .string()
    .oneOf(Object.values(EventVisibility), '有効な公開設定を選択してください')
    .default(EventVisibility.Private),

  creatorId: yup.string().required('作成者IDは必須です'),
});

// Default form values
export const getDefaultEventFormValues = (creatorId: string): EventFormData => {
  const now = getCurrentDateTime();
  const oneHourLater = new Date(Date.now() + 60 * 60 * 1000);
  const oneHourLaterLocal = new Date(
    oneHourLater.getTime() - oneHourLater.getTimezoneOffset() * 60000
  );

  return {
    title: '',
    description: '',
    startTime: now,
    endTime: oneHourLaterLocal.toISOString().slice(0, 16),
    emoji: '🎉',
    visibility: EventVisibility.Private,
    creatorId,
  };
};
