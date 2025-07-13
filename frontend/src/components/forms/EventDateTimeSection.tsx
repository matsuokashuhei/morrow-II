import React from 'react';
import { DatePicker } from './DatePicker';

interface EventDateTimeSectionProps {
  errors: Record<string, string>;
  register: any;
}

const EventDateTimeSection: React.FC<EventDateTimeSectionProps> = ({
  errors,
  register,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">日時設定</h3>

      <div className="space-y-4">
        {/* Start Date Time */}
        <DatePicker
          label="開始日時"
          id="startTime"
          showTime
          error={errors.startTime}
          {...register('startTime')}
        />

        {/* End Date Time */}
        <DatePicker
          label="終了日時"
          id="endTime"
          showTime
          error={errors.endTime}
          {...register('endTime')}
        />

        {/* Helper Text */}
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <p className="font-medium text-blue-900 mb-1">💡 ヒント</p>
          <ul className="space-y-1 text-blue-800">
            <li>• 開始日時は現在時刻以降を選択してください</li>
            <li>• 終了日時は開始日時以降を選択してください</li>
            <li>• 短時間のイベントでも1時間以上の設定を推奨します</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EventDateTimeSection;
