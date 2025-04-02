export interface Cell {
  value: string;
  isEditing: boolean;
}

export interface Column {
  id: string;
  name: string;
  prompt: string;
  isProcessing: boolean;
  width: number;
}

export type ResponseFormat = 'text' | 'json' | 'html' | 'csv';

export interface ResponseStructure {
  title?: boolean;
  description?: boolean;
  keywords?: boolean;
  categories?: boolean;
  summary?: boolean;
  analysis?: boolean;
  custom?: string[];
}

export type AIProvider = 'gemini' | 'chatgpt' | 'mistral';

export interface Settings {
  aiProvider: AIProvider;
  geminiApiKey: string;
  openaiApiKey: string;
  mistralApiKey: string;
  aiModel: 'gemini-pro' | 'gpt-3.5-turbo' | 'gpt-4' | 'mistral-tiny' | 'mistral-small' | 'mistral-medium';
  temperature: number;
  maxTokens: number;
  autoSave: boolean;
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'fr';
  processingDelay: number;
  rateLimit: number;
  requestCount: number;
  lastRequestTime: number;
  responseFormat: ResponseFormat;
  responseStructure: ResponseStructure;
}

export interface SpreadsheetState {
  data: Cell[][];
  columns: Column[];
  selectedCell: { row: number; col: number } | null;
  settings: Settings;
  history: Cell[][][];
  historyIndex: number;
}

export interface SpreadsheetStore extends SpreadsheetState {
  setData: (data: Cell[][]) => void;
  updateCell: (row: number, col: number, value: string) => void;
  setSelectedCell: (row: number | null, col: number | null) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  updatePrompt: (colIndex: number, prompt: string) => void;
  processColumn: (colIndex: number) => Promise<void>;
  addColumn: () => void;
  addRow: () => void;
  updateColumnName: (colIndex: number, name: string) => void;
  updateColumnWidth: (colIndex: number, width: number) => void;
  undo: () => void;
  redo: () => void;
  importData: (data: string[][], headers?: string[]) => void;
  toggleColumnProcessing: (colIndex: number) => void;
}