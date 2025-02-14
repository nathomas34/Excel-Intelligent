# AI Spreadsheet Processor

Une application web moderne pour traiter des données tabulaires avec l'IA Gemini Pro.

## 🌟 Fonctionnalités

- Interface de tableur interactive
- Intégration avec Gemini Pro AI
- Import/Export CSV
- Traitement par colonne avec des prompts personnalisés
- Thème clair/sombre
- Support multilingue (FR/EN)
- Gestion des limites de taux d'API
- Interface responsive

## 🚀 Démarrage Rapide

### Utilisation avec Docker

```bash
# Construire l'image
docker build -t ai-spreadsheet-processor .

# Lancer le conteneur
docker run -p 3000:3000 ai-spreadsheet-processor
```

L'application sera disponible sur `http://localhost:3000`

### Développement Local

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Construire pour la production
npm run build

# Prévisualiser la version de production
npm run preview
```

## 🔑 Configuration

1. Obtenir une clé API Gemini :
   - Visitez [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Connectez-vous avec votre compte Google
   - Créez une nouvelle clé API

2. Configurer l'application :
   - Ouvrez les paramètres (icône ⚙️)
   - Collez votre clé API
   - Ajustez les autres paramètres selon vos besoins

## 📝 Guide d'Utilisation

### Structure des Données
- Chaque colonne peut avoir un prompt IA personnalisé
- Les données sont traitées ligne par ligne
- Les résultats sont générés dans la même colonne

### Prompts IA
1. Cliquez sur l'en-tête d'une colonne
2. Entrez votre prompt dans le champ "Enter prompt..."
3. Utilisez le bouton ▶️ pour traiter la colonne

### Import/Export
- Importez des fichiers CSV avec le bouton 📤
- Exportez vos données avec le bouton 📥

### Limites de Taux
- Configuration par minute dans les paramètres
- File d'attente automatique si la limite est atteinte
- Reprise automatique après la période de limitation

## ⚙️ Configuration Avancée

### Paramètres du Modèle
- **Température** : Contrôle la créativité (0-2)
- **Tokens Max** : Limite la longueur des réponses
- **Délai de Traitement** : Pause entre les requêtes

### Sécurité
- Stockage local de la clé API
- Filtrage du contenu inapproprié
- Politiques de sécurité intégrées

## 🛠️ Architecture Technique

### Frontend
- React 18 avec TypeScript
- Zustand pour la gestion d'état
- Tailwind CSS pour le style
- Lucide React pour les icônes

### Conteneurisation
- Image de base Node.js
- Build en plusieurs étapes
- Configuration optimisée pour la production

### Performance
- Build optimisé Vite
- Gestion efficace des états
- Mise en cache des traductions

## 📦 Structure du Projet

```
.
├── src/
│   ├── components/     # Composants React
│   ├── hooks/         # Hooks personnalisés
│   ├── i18n/          # Traductions
│   ├── store/         # Gestion d'état Zustand
│   └── types/         # Types TypeScript
├── public/            # Assets statiques
├── Dockerfile         # Configuration Docker
└── docker-compose.yml # Configuration Docker Compose
```

## 🤝 Contribution

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.