import React, { useState } from 'react';
import { useSpreadsheetStore } from '../store';
import { useTranslation } from '../hooks/useTranslation';
import { ResponseFormat, ResponseStructure } from '../types';
import {
  X,
  Moon,
  Sun,
  Monitor,
  Globe2,
  Zap,
  Clock,
  Save,
  Key,
  Cpu,
  Gauge,
  ExternalLink,
  FileJson,
  FileText,
  FileSpreadsheet,
  FileCode,
  Plus,
  Minus,
} from 'lucide-react';

export const Settings: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { settings, updateSettings } = useSpreadsheetStore();
  const { t } = useTranslation();
  const [newCustomField, setNewCustomField] = useState('');

  if (!isOpen) return null;

  const handleThemeChange = (theme: typeof settings.theme) => {
    updateSettings({ theme });
  };

  const handleLanguageChange = (language: typeof settings.language) => {
    updateSettings({ language });
  };

  const handleFormatChange = (format: ResponseFormat) => {
    updateSettings({ responseFormat: format });
  };

  const handleStructureChange = (field: keyof ResponseStructure, value: boolean) => {
    updateSettings({
      responseStructure: {
        ...settings.responseStructure,
        [field]: value,
      },
    });
  };

  const addCustomField = () => {
    if (newCustomField.trim()) {
      const custom = [...(settings.responseStructure.custom || []), newCustomField.trim()];
      updateSettings({
        responseStructure: {
          ...settings.responseStructure,
          custom,
        },
      });
      setNewCustomField('');
    }
  };

  const removeCustomField = (index: number) => {
    const custom = settings.responseStructure.custom?.filter((_, i) => i !== index) || [];
    updateSettings({
      responseStructure: {
        ...settings.responseStructure,
        custom,
      },
    });
  };

  const openGeminiConsole = () => {
    window.open('https://makersuite.google.com/app/apikey', '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[800px] max-w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white">{t('settings.title')}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* API Configuration */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium flex items-center gap-2 dark:text-white">
              <Key className="w-5 h-5" />
              {t('settings.apiConfiguration.title')}
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('settings.apiConfiguration.apiKey.label')}
                  </label>
                  <button
                    onClick={openGeminiConsole}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                  >
                    {t('settings.apiConfiguration.apiKey.getKey')} <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={settings.apiKey}
                  onChange={(e) => updateSettings({ apiKey: e.target.value })}
                  placeholder={t('settings.apiConfiguration.apiKey.placeholder')}
                />
                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                  <p>{t('settings.apiConfiguration.apiKey.description')}</p>
                  <ol className="list-decimal list-inside space-y-1 mt-2">
                    <li>{t('settings.apiConfiguration.apiKey.steps.1')}</li>
                    <li>{t('settings.apiConfiguration.apiKey.steps.2')}</li>
                    <li>{t('settings.apiConfiguration.apiKey.steps.3')}</li>
                  </ol>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('settings.apiConfiguration.model.label')}
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={settings.aiModel}
                  onChange={(e) =>
                    updateSettings({ aiModel: e.target.value as any })
                  }
                >
                  <option value="gemini-pro">Gemini Pro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Response Format Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium flex items-center gap-2 dark:text-white">
              <FileText className="w-5 h-5" />
              Format de Réponse
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => handleFormatChange('text')}
                  className={`p-3 rounded-lg border flex flex-col items-center gap-2 ${
                    settings.responseFormat === 'text'
                      ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-300'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                  }`}
                >
                  <FileText className="w-6 h-6" />
                  <span className="text-sm font-medium">Texte</span>
                </button>

                <button
                  onClick={() => handleFormatChange('json')}
                  className={`p-3 rounded-lg border flex flex-col items-center gap-2 ${
                    settings.responseFormat === 'json'
                      ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-300'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                  }`}
                >
                  <FileJson className="w-6 h-6" />
                  <span className="text-sm font-medium">JSON</span>
                </button>

                <button
                  onClick={() => handleFormatChange('html')}
                  className={`p-3 rounded-lg border flex flex-col items-center gap-2 ${
                    settings.responseFormat === 'html'
                      ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-300'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                  }`}
                >
                  <FileCode className="w-6 h-6" />
                  <span className="text-sm font-medium">HTML</span>
                </button>

                <button
                  onClick={() => handleFormatChange('csv')}
                  className={`p-3 rounded-lg border flex flex-col items-center gap-2 ${
                    settings.responseFormat === 'csv'
                      ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-300'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                  }`}
                >
                  <FileSpreadsheet className="w-6 h-6" />
                  <span className="text-sm font-medium">CSV</span>
                </button>
              </div>

              <div className="space-y-4 mt-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Structure de la Réponse
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.responseStructure.title}
                      onChange={(e) => handleStructureChange('title', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Titre</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.responseStructure.description}
                      onChange={(e) => handleStructureChange('description', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Description</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.responseStructure.keywords}
                      onChange={(e) => handleStructureChange('keywords', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Mots-clés</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.responseStructure.categories}
                      onChange={(e) => handleStructureChange('categories', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Catégories</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.responseStructure.summary}
                      onChange={(e) => handleStructureChange('summary', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Résumé</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.responseStructure.analysis}
                      onChange={(e) => handleStructureChange('analysis', e.target.checked)}
                      className="rounded border-gray- gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Analyse</span>
                  </label>
                </div>

                <div className="space-y-4 mt-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Champs Personnalisés
                  </h4>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCustomField}
                      onChange={(e) => setNewCustomField(e.target.value)}
                      placeholder="Ajouter un champ personnalisé..."
                      className="flex-1 px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <button
                      onClick={addCustomField}
                      disabled={!newCustomField.trim()}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter
                    </button>
                  </div>

                  <div className="space-y-2">
                    {settings.responseStructure.custom?.map((field, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{field}</span>
                        <button
                          onClick={() => removeCustomField(index)}
                          className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Model Parameters */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium flex items-center gap-2 dark:text-white">
              <Cpu className="w-5 h-5" />
              Paramètres du Modèle
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Température
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={settings.temperature}
                    onChange={(e) =>
                      updateSettings({ temperature: Number(e.target.value) })
                    }
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12 text-center dark:text-white">
                    {settings.temperature}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Contrôle la créativité : 0 est focalisé, 2 est plus créatif
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tokens Maximum
                </label>
                <input
                  type="number"
                  min="1"
                  max="4096"
                  value={settings.maxTokens}
                  onChange={(e) =>
                    updateSettings({ maxTokens: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Longueur maximale de la réponse générée
                </p>
              </div>
            </div>
          </div>

          {/* Rate Limit Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium flex items-center gap-2 dark:text-white">
              <Gauge className="w-5 h-5" />
              Limites de Taux
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Requêtes par Minute
                </label>
                <input
                  type="number"
                  min="1"
                  max="300"
                  value={settings.rateLimit}
                  onChange={(e) =>
                    updateSettings({ rateLimit: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Nombre maximum de requêtes API autorisées par minute
                </p>
              </div>
            </div>
          </div>

          {/* Processing Options */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium flex items-center gap-2 dark:text-white">
              <Zap className="w-5 h-5" />
              Options de Traitement
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sauvegarde Automatique
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sauvegarder automatiquement les modifications
                  </p>
                </div>
                <div className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={settings.autoSave}
                    onChange={(e) =>
                      updateSettings({ autoSave: e.target.checked })
                    }
                  />
                  <span className="absolute inset-0 rounded-full bg-gray-300 peer-checked:bg-blue-500 transition-colors" />
                  <span className="absolute inset-y-1 left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Délai de Traitement (ms)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={settings.processingDelay}
                  onChange={(e) =>
                    updateSettings({ processingDelay: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Délai entre le traitement de chaque cellule pour éviter les limites de taux
                </p>
              </div>
            </div>
          </div>

          {/* Interface Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium flex items-center gap-2 dark:text-white">
              <Monitor className="w-5 h-5" />
              Paramètres d'Interface
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Thème
                </label>
                <div className="flex gap-2">
                  <button
                    className={`flex-1 p-2 rounded-md border flex items-center justify-center gap-2 dark:border-gray-600 ${
                      settings.theme === 'light'
                        ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-300'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => handleThemeChange('light')}
                  >
                    <Sun className="w-4 h-4" />
                    Clair
                  </button>
                  <button
                    className={`flex-1 p-2 rounded-md border flex items-center justify-center gap-2 dark:border-gray-600 ${
                      settings.theme === 'dark'
                        ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-300'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => handleThemeChange('dark')}
                  >
                    <Moon className="w-4 h-4" />
                    Sombre
                  </button>
                  <button
                    className={`flex-1 p-2 rounded-md border flex items-center justify-center gap-2 dark:border-gray-600 ${
                      settings.theme === 'system'
                        ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-300'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => handleThemeChange('system')}
                  >
                    <Monitor className="w-4 h-4" />
                    Système
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Langue
                </label>
                <div className="flex gap-2">
                  <button
                    className={`flex-1 p-2 rounded-md border flex items-center justify-center gap-2 dark:border-gray-600 ${
                      settings.language === 'en'
                        ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-300'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => handleLanguageChange('en')}
                  >
                    <Globe2 className="w-4 h-4" />
                    English
                  </button>
                  <button
                    className={`flex-1 p-2 rounded-md border flex items-center justify-center gap-2 dark:border-gray-600 ${
                      settings.language === 'fr'
                        ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-300'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => handleLanguageChange('fr')}
                  >
                    <Globe2 className="w-4 h-4" />
                    Français
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {t('settings.buttons.save')}
          </button>
        </div>
      </div>
    </div>
  );
};