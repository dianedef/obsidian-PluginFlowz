# Obsidian Plugins Development Environment

Un environnement de développement moderne pour créer et maintenir plusieurs plugins Obsidian avec du code partagé.

## 🌟 Caractéristiques

- 🔄 Build simultané de plusieurs plugins
- 📦 Configuration Vite optimisée
- 🧪 Tests unitaires centralisés
- 🛠 Code partagé entre plugins
- 🔍 Hot reload automatique

## 🚀 Démarrage

1. **Cloner le repository**
```bash
git clone https://github.com/dianedef/obsidian-development.git
cd obsidian-development
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Structure des plugins**
Chaque plugin doit suivre cette structure :
```
obsidian-my-plugin/
├── src/
│   ├── main.ts      # Point d'entrée obligatoire
│   └── ...          # Autres fichiers du plugin
├── manifest.json    # Manifest Obsidian
└── styles.css       # Styles optionnels
```

## 📁 Architecture

```
.
├── obsidian---plugin-boilerplate/  # Template de base pour nouveaux plugins
├── obsidian-plugin1/               # Plugin 1
├── obsidian-plugin2/               # Plugin 2
├── tests/                          # Tests partagés
│   ├── __mocks__/                 # Mocks globaux
│   └── services/                  # Tests des services
└── vite.config.ts                 # Configuration build
```

## 🛠 Développement

1. **Créer un nouveau plugin**
- Copier le dossier `obsidian---plugin-boilerplate`
- Renommer en `obsidian-my-plugin`
- Modifier `manifest.json` selon vos besoins

2. **Développement**
```bash
npm run dev
```
Le build se fait automatiquement pour tous les plugins ayant un fichier `src/main.ts` ou `src/main.js`. Il génère un fichier `main.js` à la racine du dossier de chaque plugin et Obsidian le charge automatiquement.

3. **Build production**
```bash
npm run build
```

## 🔄 Comment ça marche

- Vite détecte automatiquement tous les dossiers commençant par `obsidian-`
- Chaque plugin est buildé dans son propre dossier
- Le hot reload surveille les changements dans tous les plugins
- Les tests sont centralisés mais peuvent être spécifiques à chaque plugin

## 📚 Tests

```bash
# Lancer tous les tests
npm test

# Lancer les tests avec UI
npm run test:ui

# Couverture de code
npm run test:coverage
```

## 🤝 Contribution

1. Créez votre plugin dans un nouveau dossier `obsidian-my-plugin`
2. Assurez-vous d'avoir un `src/main.ts` ou `src/main.js`
3. Le build se fera automatiquement

## 📄 License

MIT - voir [LICENSE](./LICENSE)

## 🔧 Configuration avancée

Le fichier `vite.config.ts` peut être personnalisé pour :
- Ajouter des dépendances externes
- Modifier les chemins de build
- Configurer des alias
- Ajuster les options de build