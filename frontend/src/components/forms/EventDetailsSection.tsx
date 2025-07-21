import React from 'react';
import { FormField } from './FormField';
import { TextArea } from './TextArea';
import { EventVisibility } from '../../graphql/generated';

interface EventDetailsSectionProps {
  errors: Record<string, string>;
  register: any;
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
          data-testid="title-input"
          type="text"
          label="イベント名"
          name="title"
          required
          tabIndex={1}
          maxLength={100}
          error={errors.title}
          placeholder="例: 誕生日パーティー"
          {...register('title')}
        />

        {/* Event Description */}
        <TextArea
          data-testid="description-input"
          label="説明"
          id="description"
          placeholder="イベントの詳細を入力してください（任意）"
          rows={3}
          tabIndex={2}
          error={errors.description}
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
              data-testid="emoji-input"
              type="text"
              id="emoji"
              placeholder="🎉"
              maxLength={2}
              tabIndex={3}
              className="w-16 text-center text-2xl border border-gray-300 rounded-lg px-2 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              {...register('emoji')}
            />
            <span className="text-sm text-gray-500">
              イベントを表す絵文字を選択してください
            </span>
          </div>
          {errors.emoji && (
            <p className="text-sm text-red-600">{errors.emoji}</p>
          )}
        </div>

        {/* Visibility Settings */}
        <div className="space-y-2">
          <label
            htmlFor="visibility-fieldset"
            className="block text-sm font-medium text-gray-700"
          >
            公開設定
          </label>
          <fieldset
            id="visibility-fieldset"
            data-testid="visibility-select"
            className="space-y-2"
          >
            <legend className="sr-only">公開設定を選択してください</legend>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  data-testid="visibility-private"
                  type="radio"
                  name="visibility"
                  value={EventVisibility.Private}
                  tabIndex={4}
                  checked={
                    register('visibility').value === EventVisibility.Private
                  }
                  onChange={register('visibility').onChange}
                  className="mr-2"
                />
                <span className="text-sm">プライベート（自分のみ）</span>
              </label>
              <label className="flex items-center">
                <input
                  data-testid="visibility-shared"
                  type="radio"
                  name="visibility"
                  value={EventVisibility.Shared}
                  tabIndex={5}
                  checked={
                    register('visibility').value === EventVisibility.Shared
                  }
                  onChange={register('visibility').onChange}
                  className="mr-2"
                />
                <span className="text-sm">共有（招待された人のみ）</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  value={EventVisibility.Public}
                  checked={
                    register('visibility').value === EventVisibility.Public
                  }
                  onChange={register('visibility').onChange}
                  className="mr-2"
                />
                <span className="text-sm">パブリック（誰でも閲覧可能）</span>
              </label>
            </div>
            {errors.visibility && (
              <p className="text-sm text-red-600">{errors.visibility}</p>
            )}
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsSection;
