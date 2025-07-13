import React from 'react';
// import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { FormField } from './FormField';
import { TextArea } from './TextArea';
// import { EventFormData } from '../../utils/eventValidation';
import { EventVisibility } from '../../graphql/generated';

interface EventDetailsSectionProps {
  // errors: FieldErrors<EventFormData>;
  // register: UseFormRegister<EventFormData>;
  errors?: any;
  register?: any;
}

const EventDetailsSection: React.FC<EventDetailsSectionProps> = ({
  errors,
  register,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">イベント詳細</h3>

      <div className="space-y-4">
        {/* Event Title */}
        <FormField
          label="イベント名"
          name="title"
          required
          error={errors.title?.message}
          placeholder="例: 誕生日パーティー"
          {...register('title')}
        />

        {/* Event Description */}
        <TextArea
          label="説明"
          id="description"
          placeholder="イベントの詳細を入力してください（任意）"
          rows={3}
          error={errors.description?.message}
          {...register('description')}
        />

        {/* Emoji Picker */}
        <div className="space-y-2">
          <label
            htmlFor="emoji"
            className="block text-sm font-medium text-gray-700"
          >
            絵文字
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              id="emoji"
              placeholder="🎉"
              maxLength={2}
              className="w-16 text-center text-2xl border border-gray-300 rounded-lg px-2 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              {...register('emoji')}
            />
            <span className="text-sm text-gray-500">
              イベントを表す絵文字を選択してください
            </span>
          </div>
          {errors.emoji && (
            <p className="text-sm text-red-600">{errors.emoji.message}</p>
          )}
        </div>

        {/* Visibility Settings */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            公開設定
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value={EventVisibility.Private}
                className="mr-2"
                {...register('visibility')}
              />
              <span className="text-sm">プライベート（自分のみ）</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value={EventVisibility.Shared}
                className="mr-2"
                {...register('visibility')}
              />
              <span className="text-sm">共有（招待された人のみ）</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value={EventVisibility.Public}
                className="mr-2"
                {...register('visibility')}
              />
              <span className="text-sm">パブリック（誰でも閲覧可能）</span>
            </label>
          </div>
          {errors.visibility && (
            <p className="text-sm text-red-600">{errors.visibility.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsSection;
