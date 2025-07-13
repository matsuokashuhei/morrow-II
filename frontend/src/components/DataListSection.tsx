import React from 'react';
import { Card } from './ui/Card';

interface DataItem {
  id: string;
  [key: string]: any;
}

interface DataListSectionProps<T extends DataItem> {
  title: string;
  data: T[];
  error?: Error | null;
  renderItem: (item: T) => React.ReactNode;
  emptyMessage?: string;
}

export function DataListSection<T extends DataItem>({
  title,
  data,
  error,
  renderItem,
  emptyMessage = `No ${title.toLowerCase()} found`,
}: DataListSectionProps<T>) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">
            Error loading {title.toLowerCase()}:
          </h3>
          <p className="text-red-600 text-sm mt-1">{error.message}</p>
        </div>
      ) : data.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <p className="text-gray-600">{emptyMessage}</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {data.map(item => (
            <li
              key={item.id}
              className="bg-gray-50 rounded-md p-3 border border-gray-200"
            >
              {renderItem(item)}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
