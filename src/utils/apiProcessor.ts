import axios from 'axios';
import { ProcessedData } from './fileProcessors';

interface ApiConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  dataPath?: string;
  headerMapping?: Record<string, string>;
}

export const processApiResponse = async (config: ApiConfig): Promise<ProcessedData> => {
  try {
    const response = await axios({
      method: config.method,
      url: config.url,
      headers: config.headers,
      data: config.method !== 'GET' ? config.body : undefined
    });

    // Extraire les données selon le chemin spécifié
    let data = response.data;
    if (config.dataPath) {
      const paths = config.dataPath.split('.');
      for (const path of paths) {
        data = data[path];
      }
    }

    if (!Array.isArray(data)) {
      throw new Error('Les données de l\'API doivent être un tableau');
    }

    // Détecter les en-têtes à partir du premier objet
    const firstItem = data[0];
    const headers = Object.keys(firstItem).map(key => 
      config.headerMapping?.[key] || key
    );

    // Transformer les données en tableau 2D
    const rows = data.map(item =>
      headers.map(header => {
        const originalHeader = Object.keys(config.headerMapping || {})
          .find(key => config.headerMapping?.[key] === header) || header;
        return String(item[originalHeader] || '');
      })
    );

    return {
      headers,
      data: rows
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données de l\'API:', error);
    throw new Error('Impossible de récupérer les données de l\'API');
  }
};