import React, { useState } from 'react';
import { FormContainer } from './FormContainer';
import EventDetailsSection from './EventDetailsSection';
import EventDateTimeSection from './EventDateTimeSection';
import { Button } from '../ui/Button';
import { useCreateEvent } from '../../hooks/useCreateEvent';
import {
  eventValidationSchema,
  EventFormData,
  getDefaultEventFormValues,
} from '../../utils/eventValidation';

interface EventCreationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EventCreationForm: React.FC<EventCreationFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { createEvent, loading, error } = useCreateEvent();

  // MVP: Using default user ID until authentication is implemented
  // TODO: Replace with actual user ID from auth context in next phase
  const getMvpUserId = () => '1';

  const [formData, setFormData] = useState<EventFormData>(
    getDefaultEventFormValues(getMvpUserId())
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use Yup schema for validation
  const validateForm = async (): Promise<boolean> => {
    try {
      await eventValidationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationError: any) {
      const newErrors: Record<string, string> = {};

      if (validationError.inner) {
        validationError.inner.forEach((error: any) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
      }

      setErrors(newErrors);
      return false;
    }
  };

  const onSubmit = async (data: EventFormData) => {
    try {
      await createEvent({
        title: data.title,
        description: data.description || undefined,
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
        emoji: data.emoji || undefined,
        visibility: data.visibility,
        creatorId: data.creatorId,
      });

      onSuccess?.();
    } catch (err) {
      console.error('Failed to create event:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await validateForm();
    if (isValid) {
      await onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof EventFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Create a register-like function for form fields
  const register = (field: keyof EventFormData) => ({
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
