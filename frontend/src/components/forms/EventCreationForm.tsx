import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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

  // Use React Hook Form with Yup resolver
  const {
    register: rhfRegister,
    handleSubmit,
    formState: { errors: rhfErrors },
    watch,
  } = useForm<EventFormData>({
    resolver: yupResolver(eventValidationSchema),
    defaultValues: getDefaultEventFormValues(getMvpUserId()),
  });

  // Convert React Hook Form errors to the format expected by child components
  const errors = React.useMemo(() => {
    const convertedErrors: Record<string, string> = {};
    Object.keys(rhfErrors).forEach(key => {
      const error = rhfErrors[key as keyof EventFormData];
      if (error?.message) {
        convertedErrors[key] = error.message;
      }
    });
    return convertedErrors;
  }, [rhfErrors]);

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

  // Create a register function compatible with our existing child components
  const register = useCallback(
    (field: keyof EventFormData) => {
      const fieldRegistration = rhfRegister(field);
      const fieldValue = watch(field);

      return {
        ...fieldRegistration,
        value: fieldValue,
        onChange: fieldRegistration.onChange,
      };
    },
    [rhfRegister, watch]
  );

  return (
    <FormContainer
      data-testid="event-creation-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            新しいイベントを作成
          </h2>
          <p className="text-gray-600 mt-2">
            みんなで楽しみにできるイベントを作成しましょう
          </p>
        </div>

        {/* Form-level error messages */}
        {error && (
          <div
            data-testid="error-message"
            aria-live="polite"
            className="bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <p className="text-red-700 text-sm">
              エラーが発生しました:{' '}
              {typeof error === 'string'
                ? error
                : error.message || 'Unknown error'}
            </p>
          </div>
        )}

        {/* General validation errors */}
        {Object.keys(errors).length > 0 && (
          <div
            data-testid="error-message"
            aria-live="polite"
            className="bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <p className="text-red-700 text-sm font-medium mb-2">
              入力内容をご確認ください:
            </p>
            <ul className="text-red-700 text-sm list-disc list-inside space-y-1">
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        <EventDetailsSection errors={errors} register={register} />

        <EventDateTimeSection errors={errors} register={register} />

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          {onCancel && (
            <Button
              data-testid="cancel-btn"
              variant="secondary"
              onClick={onCancel}
              type="button"
              tabIndex={9}
            >
              キャンセル
            </Button>
          )}
          <Button
            data-testid="submit-btn"
            type="submit"
            loading={loading}
            disabled={loading}
            tabIndex={8}
          >
            {loading ? 'イベント作成中...' : 'イベントを作成'}
          </Button>
        </div>
      </div>
    </FormContainer>
  );
};

export default EventCreationForm;
