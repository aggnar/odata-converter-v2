'use client';

import { useState } from 'react';
import { ParsedResult } from '@/lib/odata-parser';
import CollapsibleJson from '@/components/CollapsibleJson';

export default function Home() {
  const [metadata, setMetadata] = useState('');
  const [result, setResult] = useState<ParsedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({ actions: true, functions: true, entities: true, complexTypes: true });

  const copyToClipboard = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  const handleParse = async () => {
    if (!metadata.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/parse/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metadata })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">OData Metadata Parser</h1>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Paste OData Metadata XML:
        </label>
        <textarea
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
          className="w-full h-40 p-2 border border-gray-300 rounded"
          placeholder="Paste your OData metadata XML here..."
        />
      </div>
      
      <button
        onClick={handleParse}
        disabled={loading || !metadata.trim()}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
      >
        {loading ? 'Parsing...' : 'Parse Metadata'}
      </button>

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Parsed Result</h2>
          
          {result.actions?.length > 0 && (
            <div className="mb-6">
              <h3 
                className="text-lg font-medium mb-2 cursor-pointer flex items-center"
                onClick={() => setCollapsed(prev => ({ ...prev, actions: !prev.actions }))}
              >
                {collapsed.actions ? '▶' : '▼'} Actions (POST)
              </h3>
              {!collapsed.actions && result.actions.map((action, index) => (
                <div key={index} className="mb-4 p-4 border rounded">
                  <h4 
                    className="font-medium cursor-pointer flex items-center"
                    onClick={() => setCollapsed(prev => ({ ...prev, [`action-${index}`]: !prev[`action-${index}`] }))}
                  >
                    {collapsed[`action-${index}`] ? '▶' : '▼'} {action.name}
                  </h4>
                  {!collapsed[`action-${index}`] && (
                    <>
                      <div className="mt-2">
                        <div className="flex items-center justify-between">
                          <strong>Parameters:</strong>
                          <button 
                            onClick={() => copyToClipboard(action.parameters)}
                            className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                          >
                            Copy
                          </button>
                        </div>
                        <CollapsibleJson data={action.parameters} />
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between">
                          <strong>Return:</strong>
                          <button 
                            onClick={() => copyToClipboard(action.returnType)}
                            className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                          >
                            Copy
                          </button>
                        </div>
                        <CollapsibleJson data={action.returnType} />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {result.functions?.length > 0 && (
            <div className="mb-6">
              <h3 
                className="text-lg font-medium mb-2 cursor-pointer flex items-center"
                onClick={() => setCollapsed(prev => ({ ...prev, functions: !prev.functions }))}
              >
                {collapsed.functions ? '▶' : '▼'} Functions (GET)
              </h3>
              {!collapsed.functions && result.functions.map((func, index) => (
                <div key={index} className="mb-4 p-4 border rounded">
                  <h4 
                    className="font-medium cursor-pointer flex items-center"
                    onClick={() => setCollapsed(prev => ({ ...prev, [`function-${index}`]: !prev[`function-${index}`] }))}
                  >
                    {collapsed[`function-${index}`] ? '▶' : '▼'} {func.name}
                  </h4>
                  {!collapsed[`function-${index}`] && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between">
                        <strong>Return:</strong>
                        <button 
                          onClick={() => copyToClipboard(func.returnType)}
                          className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                        >
                          Copy
                        </button>
                      </div>
                      <CollapsibleJson data={func.returnType} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {result.entities && Object.keys(result.entities).length > 0 && (
            <div className="mb-6">
              <h3 
                className="text-lg font-medium mb-2 cursor-pointer flex items-center"
                onClick={() => setCollapsed(prev => ({ ...prev, entities: !prev.entities }))}
              >
                {collapsed.entities ? '▶' : '▼'} Entities
              </h3>
              {!collapsed.entities && Object.entries(result.entities).map(([entityName, properties]) => (
                <div key={entityName} className="mb-4 p-4 border rounded">
                  <h4 
                    className="font-medium cursor-pointer flex items-center"
                    onClick={() => setCollapsed(prev => ({ ...prev, [`entity-${entityName}`]: !prev[`entity-${entityName}`] }))}
                  >
                    {collapsed[`entity-${entityName}`] ? '▶' : '▼'} {entityName}
                  </h4>
                  {!collapsed[`entity-${entityName}`] && (
                    <div>
                      <div className="flex justify-end mb-2">
                        <button 
                          onClick={() => copyToClipboard(properties)}
                          className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                        >
                          Copy
                        </button>
                      </div>
                      <CollapsibleJson data={properties} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {result.complexTypes && Object.keys(result.complexTypes).length > 0 && (
            <div className="mb-6">
              <h3 
                className="text-lg font-medium mb-2 cursor-pointer flex items-center"
                onClick={() => setCollapsed(prev => ({ ...prev, complexTypes: !prev.complexTypes }))}
              >
                {collapsed.complexTypes ? '▶' : '▼'} Complex Types
              </h3>
              {!collapsed.complexTypes && Object.entries(result.complexTypes).map(([typeName, properties]) => (
                <div key={typeName} className="mb-4 p-4 border rounded">
                  <h4 
                    className="font-medium cursor-pointer flex items-center"
                    onClick={() => setCollapsed(prev => ({ ...prev, [`complexType-${typeName}`]: !prev[`complexType-${typeName}`] }))}
                  >
                    {collapsed[`complexType-${typeName}`] ? '▶' : '▼'} {typeName}
                  </h4>
                  {!collapsed[`complexType-${typeName}`] && (
                    <div>
                      <div className="flex justify-end mb-2">
                        <button 
                          onClick={() => copyToClipboard(properties)}
                          className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                        >
                          Copy
                        </button>
                      </div>
                      <CollapsibleJson data={properties} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}