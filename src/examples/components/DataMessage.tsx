import React, { JSX } from 'react';

const renderValue = (value: unknown): JSX.Element => {
  if (typeof value === 'object' && value !== null) {
    return (
      <div className="ml-4">
        {Object.entries(value).map(([key, val]) => (
          <div key={key}>
            <span className="font-semibold">{key}: </span>
            {renderValue(val)}
          </div>
        ))}
      </div>
    );
  }
  return <span>{String(value)}</span>;
};

interface DataMessageProps {
  data: Record<string, unknown>;
}

export function DataMessage({ data }: DataMessageProps) {
  return (
    <div className="p-3 min-h-[3rem] min-w-[250px]">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex justify-between items-start">
          <div>
            <span className="">{key}: </span>
            {renderValue(value)}
          </div>
        </div>
      ))}
    </div>
  );
}
