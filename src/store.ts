import { create } from 'zustand';
import { SpreadsheetStore, Settings, ResponseFormat, ResponseStructure } from './types';

const INITIAL_ROWS = 5;
const INITIAL_COLS = 3;
const DEFAULT_COLUMN_WIDTH = 200;

// Charger les paramètres depuis le localStorage
const loadSettings = (): Settings => {
  const storedSettings = Object.fromEntries(
    ['theme', 'language', 'apiKey', 'temperature', 'maxTokens', 'autoSave', 'processingDelay', 'rateLimit', 'responseFormat', 'responseStructure']
      .map(key => [key, localStorage.getItem(`settings.${key}`)])
      .filter(([_, value]) => value !== null)
  );

  const responseStructure: ResponseStructure = storedSettings.responseStructure 
    ? JSON.parse(storedSettings.responseStructure)
    : {
        title: true,
        description: true,
        keywords: false,
        categories: false,
        summary: false,
        analysis: false,
        custom: [],
      };

  return {
    apiKey: storedSettings.apiKey || '',
    aiModel: 'gemini-pro',
    temperature: Number(storedSettings.temperature) || 0.7,
    maxTokens: Number(storedSettings.maxTokens) || 2048,
    autoSave: storedSettings.autoSave === 'true',
    theme: (storedSettings.theme as Settings['theme']) || 'system',
    language: (storedSettings.language as Settings['language']) || 'fr',
    processingDelay: Number(storedSettings.processingDelay) || 1000,
    rateLimit: Number(storedSettings.rateLimit) || 60,
    requestCount: 0,
    lastRequestTime: Date.now(),
    responseFormat: (storedSettings.responseFormat as ResponseFormat) || 'text',
    responseStructure,
  };
};

const DEFAULT_SETTINGS = loadSettings();

const createInitialData = (rows: number, cols: number) => {
  return Array(rows).fill(null).map(() =>
    Array(cols).fill(null).map(() => ({ value: '', isEditing: false }))
  );
};

const createInitialColumns = (cols: number) => {
  return Array(cols).fill(null).map((_, index) => ({
    id: crypto.randomUUID(),
    name: `Colonne ${index + 1}`,
    prompt: '',
    isProcessing: false,
    width: DEFAULT_COLUMN_WIDTH,
  }));
};

const checkRateLimit = (settings: Settings): { canProceed: boolean; waitTime: number } => {
  const now = Date.now();
  const oneMinute = 60 * 1000;
  
  if (now - settings.lastRequestTime >= oneMinute) {
    return { canProceed: true, waitTime: 0 };
  }
  
  if (settings.requestCount >= settings.rateLimit) {
    const waitTime = oneMinute - (now - settings.lastRequestTime);
    return { canProceed: false, waitTime };
  }
  
  return { canProceed: true, waitTime: 0 };
};

function formatPromptWithStructure(basePrompt: string, input: string, settings: Settings): string {
  const { responseFormat, responseStructure } = settings;
  
  let structurePrompt = 'Format de réponse souhaité:\n';
  
  // Format de sortie
  switch (responseFormat) {
    case 'json':
      structurePrompt += '- Répondre en JSON valide uniquement\n';
      break;
    case 'html':
      structurePrompt += '- Répondre en HTML valide uniquement\n';
      break;
    case 'csv':
      structurePrompt += '- Répondre en format CSV (valeurs séparées par des virgules)\n';
      break;
    default:
      structurePrompt += '- Répondre en texte simple\n';
  }

  // Structure de la réponse
  structurePrompt += '\nStructure de la réponse:\n';
  if (responseStructure.title) structurePrompt += '- Inclure un titre\n';
  if (responseStructure.description) structurePrompt += '- Inclure une description\n';
  if (responseStructure.keywords) structurePrompt += '- Inclure des mots-clés\n';
  if (responseStructure.categories) structurePrompt += '- Inclure des catégories\n';
  if (responseStructure.summary) structurePrompt += '- Inclure un résumé\n';
  if (responseStructure.analysis) structurePrompt += '- Inclure une analyse\n';
  if (responseStructure.custom?.length) {
    structurePrompt += '\nChamps personnalisés à inclure:\n';
    responseStructure.custom.forEach(field => {
      structurePrompt += `- ${field}\n`;
    });
  }

  return `${structurePrompt}\n${basePrompt}\n\nInput: ${input}\n\nRéponse:`;
}

async function processWithGemini(prompt: string, input: string, settings: Settings, updateSettings: (settings: Partial<Settings>) => void) {
  if (!settings.apiKey?.trim()) {
    return 'Pour commencer, veuillez configurer votre clé API Gemini dans les paramètres (icône ⚙️). Vous pouvez obtenir une clé gratuite sur Google AI Studio.';
  }

  const { canProceed, waitTime } = checkRateLimit(settings);
  
  if (!canProceed) {
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return processWithGemini(prompt, input, settings, updateSettings);
  }

  try {
    const now = Date.now();
    updateSettings({
      requestCount: settings.requestCount + 1,
      lastRequestTime: now
    });

    const formattedPrompt = formatPromptWithStructure(prompt, input, settings);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${settings.apiKey.trim()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: formattedPrompt
          }]
        }],
        generationConfig: {
          temperature: settings.temperature,
          maxOutputTokens: settings.maxTokens,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur API Gemini:', errorData);
      
      if (errorData.error?.message) {
        if (errorData.error.message.includes('API key not valid')) {
          return 'La clé API n\'est pas valide. Veuillez vérifier que vous avez copié la clé complète depuis Google AI Studio et qu\'elle est correctement collée dans les paramètres (icône ⚙️).';
        } else if (errorData.error.message.includes('quota')) {
          return 'Quota d\'API dépassé. Veuillez réessayer plus tard ou vérifier les limites de votre compte Google AI Studio.';
        }
      }
      
      return 'Erreur lors du traitement : veuillez vérifier votre clé API et réessayer.';
    }

    const data = await response.json();
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text.trim();
    }
    
    if (data.promptFeedback?.blockReason) {
      return `Contenu bloqué par les règles de sécurité de l'IA : ${data.promptFeedback.blockReason}`;
    }

    return 'Pas de réponse de l\'IA. Veuillez reformuler votre demande.';
  } catch (error) {
    console.error('Erreur lors du traitement avec Gemini:', error);
    return 'Erreur de communication avec l\'IA. Veuillez vérifier votre connexion internet et réessayer.';
  }
}

export const useSpreadsheetStore = create<SpreadsheetStore>((set, get) => ({
  data: createInitialData(INITIAL_ROWS, INITIAL_COLS),
  columns: createInitialColumns(INITIAL_COLS),
  selectedCell: null,
  settings: DEFAULT_SETTINGS,
  history: [createInitialData(INITIAL_ROWS, INITIAL_COLS)],
  historyIndex: 0,

  setData: (data) => set({ data }),
  
  updateCell: (row, col, value) => {
    const newData = [...get().data];
    newData[row][col] = { ...newData[row][col], value };
    
    const newHistory = [...get().history.slice(0, get().historyIndex + 1), newData];
    set({
      data: newData,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  setSelectedCell: (row, col) => set({
    selectedCell: row !== null && col !== null ? { row, col } : null
  }),

  updateSettings: (newSettings) => {
    const settings = { ...get().settings, ...newSettings };
    
    // Sauvegarder les paramètres dans le localStorage
    Object.entries(newSettings).forEach(([key, value]) => {
      if (typeof value !== 'function' && key !== 'requestCount' && key !== 'lastRequestTime') {
        if (key === 'responseStructure') {
          localStorage.setItem(`settings.${key}`, JSON.stringify(value));
        } else {
          localStorage.setItem(`settings.${key}`, String(value));
        }
      }
    });
    
    set({ settings });
  },

  updatePrompt: (colIndex, prompt) => {
    const newColumns = [...get().columns];
    newColumns[colIndex] = { ...newColumns[colIndex], prompt };
    set({ columns: newColumns });
  },

  processColumn: async (colIndex) => {
    const { columns, data, settings, updateSettings } = get();
    const column = columns[colIndex];
    const prompt = column.prompt;

    if (!prompt?.trim()) {
      const newData = [...data];
      newData[0][colIndex] = { 
        value: 'Veuillez d\'abord entrer un prompt dans l\'en-tête de la colonne.',
        isEditing: false 
      };
      set({ data: newData });
      return;
    }

    if (!settings.apiKey?.trim()) {
      const newData = [...data];
      newData[0][colIndex] = { 
        value: 'Pour commencer, veuillez configurer votre clé API Gemini dans les paramètres (icône ⚙️). Vous pouvez obtenir une clé gratuite sur Google AI Studio.',
        isEditing: false 
      };
      set({ data: newData });
      return;
    }

    const newColumns = [...columns];
    newColumns[colIndex] = { ...column, isProcessing: true };
    set({ columns: newColumns });

    try {
      const newData = [...data];
      for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
        const input = data[rowIndex][colIndex].value;
        if (input?.trim()) {
          const result = await processWithGemini(prompt, input, settings, updateSettings);
          newData[rowIndex][colIndex] = { value: result, isEditing: false };
          set({ data: newData });
          
          if (settings.processingDelay > 0) {
            await new Promise(resolve => setTimeout(resolve, settings.processingDelay));
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors du traitement de la colonne:', error);
      const newData = [...data];
      newData[0][colIndex] = { 
        value: 'Une erreur est survenue lors du traitement. Veuillez réessayer.',
        isEditing: false 
      };
      set({ data: newData });
    } finally {
      newColumns[colIndex] = { ...column, isProcessing: false };
      set({ columns: newColumns });
    }
  },

  addColumn: () => {
    const { columns, data } = get();
    const newColumns = [...columns, {
      id: crypto.randomUUID(),
      name: `Colonne ${columns.length + 1}`,
      prompt: '',
      isProcessing: false,
      width: DEFAULT_COLUMN_WIDTH,
    }];
    
    const newData = data.map(row => [...row, { value: '', isEditing: false }]);
    set({ columns: newColumns, data: newData });
  },

  addRow: () => {
    const { data, columns } = get();
    const newRow = Array(columns.length).fill(null).map(() => ({ value: '', isEditing: false }));
    set({ data: [...data, newRow] });
  },

  updateColumnName: (colIndex, name) => {
    const newColumns = [...get().columns];
    newColumns[colIndex] = { ...newColumns[colIndex], name };
    set({ columns: newColumns });
  },

  updateColumnWidth: (colIndex, width) => {
    const newColumns = [...get().columns];
    newColumns[colIndex] = { ...newColumns[colIndex], width };
    set({ columns: newColumns });
  },

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      set({
        data: history[historyIndex - 1],
        historyIndex: historyIndex - 1,
      });
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      set({
        data: history[historyIndex + 1],
        historyIndex: historyIndex + 1,
      });
    }
  },

  importData: (csvData, headers) => {
    const newColumns = headers 
      ? headers.map((name, index) => ({
          id: crypto.randomUUID(),
          name,
          prompt: '',
          isProcessing: false,
          width: DEFAULT_COLUMN_WIDTH,
        }))
      : csvData[0].map((_, index) => ({
          id: crypto.randomUUID(),
          name: `Colonne ${index + 1}`,
          prompt: '',
          isProcessing: false,
          width: DEFAULT_COLUMN_WIDTH,
        }));

    const newData = csvData.map(row =>
      row.map(cell => ({ value: cell, isEditing: false }))
    );

    set({
      columns: newColumns,
      data: newData,
      history: [newData],
      historyIndex: 0,
    });
  },

  toggleColumnProcessing: (colIndex) => {
    const { columns, processColumn } = get();
    const column = columns[colIndex];
    
    if (column.isProcessing) {
      const newColumns = [...columns];
      newColumns[colIndex] = { ...column, isProcessing: false };
      set({ columns: newColumns });
    } else {
      processColumn(colIndex);
    }
  },
}));