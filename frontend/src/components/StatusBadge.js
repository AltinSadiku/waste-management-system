import React from 'react';

const STATUS_STYLES = {
  PENDING: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 ring-blue-200',
  RESOLVED: 'bg-green-100 text-green-800 ring-green-200',
  CLOSED: 'bg-gray-100 text-gray-800 ring-gray-200',
  DEFAULT: 'bg-gray-100 text-gray-800 ring-gray-200',
};

export default function StatusBadge({ value }) {
  const normalized = (value || 'DEFAULT').toUpperCase();
  const className = STATUS_STYLES[normalized] || STATUS_STYLES.DEFAULT;
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ring-1 ring-inset ${className}`}>
      {String(value || 'Unknown').replace('_', ' ')}
    </span>
  );
}








