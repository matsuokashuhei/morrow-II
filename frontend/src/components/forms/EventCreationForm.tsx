import React, { useState } from 'react';
import { FormContainer } from './FormContainer';
import EventDetailsSection from './EventDetailsSection';
import EventDateTimeSection from './EventDateTimeSection';
import { Button } from '../ui/Button';
import { EventVisibility } from '../../graphql/generated';
import { useCreateEvent } from '../../hooks/useCreateEvent';

interface EventCreationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormData {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  emoji: string;
  visibility: EventVisibility;
}

const EventCreationForm: React.FC<EventCreationFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { createEvent, loading, error } = useCreateEvent();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    emoji: '🎉',
    visibility: EventVisibility.Private,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Simple validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'イベント名は必須です';
    } else if (formData.title.length > 100) {
      newErrors.title = '100文字以内で入力してください';
    }

    if (formData.description.length > 500) {
      newErrors.description = '500文字以内で入力してください';
    }

    if (!formData.startTime) {
      newErrors.startTime = '開始日時は必須です';
    } else if (new Date(formData.startTime) <= new Date()) {
      newErrors.startTime = '現在時刻以降を選択してください';
    }

    if (!formData.endTime) {
      newErrors.endTime = '終了日時は必須です';
    } else if (
      formData.startTime &&
      new Date(formData.endTime) <= new Date(formData.startTime)
    ) {
      newErrors.endTime = '開始日時以降を選択してください';
    }

    if (formData.emoji.length > 2) {
      newErrors.emoji = '絵文字は2文字以内で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // TODO: Get actual user ID from auth context
      const creatorId = '1'; // Temporary hardcoded user ID

      await createEvent({
        title: formData.title,
        description: formData.description || undefined,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        emoji: formData.emoji || undefined,
        visibility: formData.visibility,
        creatorId,
      });

      onSuccess?.();
    } catch (err) {
      console.error('Failed to create event:', err);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Create a register-like function for form fields
  const register = (field: keyof FormData) => ({
    value: formData[field],
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      handleInputChange(field, e.target.value);
    },
  });

  return (
    <FormContainer>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            新しいイベントを作成
          </h2>
          <p className="text-gray-600 mt-2">
            みんなで楽しみにできるイベントを作成しましょう
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">
              エラーが発生しました: {error.message}
            </p>
          </div>
        )}

        <EventDetailsSection errors={errors} register={register} />

        <EventDateTimeSection errors={errors} register={register} />

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          {onCancel && (
            <Button variant="secondary" onClick={onCancel} type="button">
              キャンセル
            </Button>
          )}
          <Button type="submit" loading={loading} disabled={loading}>
            {loading ? 'イベント作成中...' : 'イベントを作成'}
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default EventCreationForm;
