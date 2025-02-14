import React from 'react';
import { Upload, Download, Undo2, Redo2, Play, Settings, Plus } from 'lucide-react';
import Papa from 'papaparse';
import { useSpreadsheetStore } from '../store';

interface ToolbarProps {
  onOpenSettings: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onOpenSettings }) => {
  const { undo, redo, importData, data, columns, addRow, addColumn, toggleColumnProcessing } = useSpreadsheetStore();

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const headers = results.meta.fields || [];
          const data = results.data as Record<string, string>[];
          const formattedData = data.map(row => headers.map(header => row[header] || ''));
          importData(formattedData, headers);
        },
      });
    }
  };

  const handleExport = () => {
    const headers = columns.map(col => col.name);
    const csvData = data.map(row => row.map(cell => cell.value));
    const csv = Papa.unparse({
      fields: headers,
      data: csvData,
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'spreadsheet_export.csv';
    link.click();
  };

  const handleProcessAll = () => {
    columns.forEach((_, index) => {
      if (columns[index].prompt) {
        toggleColumnProcessing(index);
      }
    });
  };

  return (
    <div className="flex items-center bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-12">
      <div className="flex items-center border-r border-gray-200 dark:border-gray-700 h-full">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileImport}
          className="hidden"
          id="file-import"
        />
        <label
          htmlFor="file-import"
          className="h-full px-3 inline-flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors text-gray-700 dark:text-gray-300"
          title="Import CSV"
        >
          <Upload className="w-5 h-5" />
        </label>
        <button
          onClick={handleExport}
          className="h-full px-3 inline-flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-l border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
          title="Export CSV"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center border-r border-gray-200 dark:border-gray-700 h-full">
        <button
          onClick={undo}
          className="h-full px-3 inline-flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          title="Undo"
        >
          <Undo2 className="w-5 h-5" />
        </button>
        <button
          onClick={redo}
          className="h-full px-3 inline-flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-l border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
          title="Redo"
        >
          <Redo2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center h-full">
        <button
          onClick={addRow}
          className="h-full px-3 inline-flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-r border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
          title="Add Row"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add Row</span>
        </button>
        <button
          onClick={addColumn}
          className="h-full px-3 inline-flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          title="Add Column"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add Column</span>
        </button>
      </div>

      <div className="flex-1" />

      <div className="flex items-center border-l border-gray-200 dark:border-gray-700 h-full">
        <button
          onClick={handleProcessAll}
          className="h-full px-3 inline-flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          title="Process All Columns"
        >
          <Play className="w-5 h-5" />
        </button>
        <button
          onClick={onOpenSettings}
          className="h-full px-3 inline-flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-l border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};