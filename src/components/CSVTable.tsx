import React from 'react';

interface CSVTableProps {
  data: any[];
  title: string;
}

export const CSVTable: React.FC<CSVTableProps> = ({ data, title }) => {
  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden my-6">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/70">
        <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
      </div>
      <div className="max-h-[450px] overflow-x-auto overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200 shadow-[0_1px_0_0_rgba(229,231,235,1)]">
              {headers.map((h) => (
                <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap bg-gray-50">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                {headers.map((h) => (
                  <td key={h} className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate whitespace-nowrap">
                    {row[h]?.toString() || <span className="text-gray-300 italic">null</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};