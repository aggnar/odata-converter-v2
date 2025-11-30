'use client';

import { useState } from 'react';

interface CollapsibleJsonProps {
  data: any;
}

export default function CollapsibleJson({ data }: CollapsibleJsonProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const renderValue = (key: string, value: any, path: string = ''): JSX.Element => {
    const currentPath = path ? `${path}.${key}` : key;

    if (value === null) return <span className="text-gray-500">null</span>;
    if (typeof value === 'string') return <span className="text-green-600">"{value}"</span>;
    if (typeof value === 'number') return <span className="text-blue-600">{value}</span>;
    if (typeof value === 'boolean') return <span className="text-purple-600">{value.toString()}</span>;

    if (Array.isArray(value)) {
      if (value.length === 0) return <span>[]</span>;
      
      return (
        <div>
          <span 
            className="cursor-pointer hover:bg-gray-200 px-1 rounded"
            onClick={() => setCollapsed(prev => ({ ...prev, [currentPath]: !prev[currentPath] }))}
          >
            {collapsed[currentPath] ? '▶' : '▼'} [{value.length}]
          </span>
          {!collapsed[currentPath] && (
            <div className="ml-4 border-l border-gray-300 pl-2">
              {value.map((item, index) => (
                <div key={index}>
                  {renderValue(index.toString(), item, currentPath)}
                  {index < value.length - 1 && <span>,</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (typeof value === 'object') {
      const keys = Object.keys(value);
      if (keys.length === 0) return <span>{'{}'}</span>;

      return (
        <div>
          <span 
            className="cursor-pointer hover:bg-gray-200 px-1 rounded"
            onClick={() => setCollapsed(prev => ({ ...prev, [currentPath]: !prev[currentPath] }))}
          >
            {collapsed[currentPath] ? '▶' : '▼'} {'{'}
          </span>
          {!collapsed[currentPath] && (
            <div className="ml-4 border-l border-gray-300 pl-2">
              {keys.map((objKey, index) => (
                <div key={objKey}>
                  <span className="text-red-600">"{objKey}"</span>: {renderValue(objKey, value[objKey], currentPath)}
                  {index < keys.length - 1 && <span>,</span>}
                </div>
              ))}
              <span>{'}'}</span>
            </div>
          )}
        </div>
      );
    }

    return <span>{String(value)}</span>;
  };

  return (
    <div className="bg-gray-100 p-2 rounded text-sm font-mono overflow-x-auto">
      {renderValue('root', data)}
    </div>
  );
}