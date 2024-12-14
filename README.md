Voici les étapes que nous avons effectuées pour corriger la gestion des événements :
Définition claire des types d'événements :
Création d'une interface IEventMap avec tous les événements possibles
Spécification des paramètres et retours pour chaque type d'événement
Support des retours asynchrones (Promise)
Mise en place de l'EventBus :
Implémentation du pattern Singleton
Gestion des souscriptions/désinscriptions aux événements
Support du debugging des événements
Gestion des erreurs dans les handlers
Dans les services :
Définition des handlers comme propriétés de classe
Utilisation de fonctions fléchées asynchrones
Conservation des références aux handlers pour le nettoyage
Initialisation et nettoyage corrects des écouteurs d'événements
Bonnes pratiques :
Typage strict des événements
Gestion propre des désabonnements
Support de l'asynchrone
Facilité de maintenance et de débogage
Ces étapes peuvent servir de guide pour implémenter un système d'événements robuste dans d'autres plugins Obsidian.


# Obsidian Plugin Boilerplate

A modern and robust template for developing Obsidian plugins with TypeScript.

## 🌟 Features

- ⚡ Modern service-based architecture
- 🧪 Complete unit testing with Vitest
- 🔄 Event Bus for component communication
- 🛠 Centralized error handling
- 🌐 Built-in i18n support
- 📦 Optimized TypeScript configuration

## 🚀 Getting Started

1. **Clone the template**
```bash
git clone https://github.com/your-repo/obsidian-plugin-boilerplate.git my-plugin
cd my-plugin
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure your plugin**
- Modify `manifest.json` with your information
- Adapt `package.json` to your needs
- Configure environment variables if needed

4. **Development**
```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── core/              # Business logic
│   ├── services/     # Reusable services
│   │   ├── EventBusService.ts
│   │   └── ErrorService.ts
│   └── types/       # Types and interfaces
├── ui/              # User interface components
└── utils/           # Utilities

tests/               # Tests
├── __mocks__/      # External module mocks
├── mocks/          # Custom mocks
└── services/       # Service tests
```

## 🛠 Available Services

### EventBusService
Event-based communication service between components.

```typescript
// Usage example
const eventBus = EventBusService.getInstance();
eventBus.on(EventName.SETTINGS_UPDATED, (settings) => {
    // Handle settings update
});
```

### ErrorService
Centralized error handling with i18n support.

```typescript
// Usage example
const errorService = ErrorService.getInstance();
errorService.handleError({
    type: ErrorType.CONFIG,
    message: 'errors.configMissing'
});
```

## 🧪 Tests

The project uses Vitest with a complete setup:

- MSW for HTTP request mocking
- Mocks for Obsidian services
- Unit and integration tests

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 Code Conventions

- **TypeScript strict mode** enabled
- **ESLint** with modern configuration
- **Prettier** for formatting
- Conventional commits

## 🔧 Customization

1. **Add a new service**
```typescript
export class MyService {
    private static instance: MyService;
    
    static getInstance(): MyService {
        if (!MyService.instance) {
            MyService.instance = new MyService();
        }
        return MyService.instance;
    }
}
```

2. **Add a new event type**
```typescript
// src/core/types/events.ts
export enum EventName {
    MY_EVENT = 'my:event'
}
```

## 📚 Documentation

- [Contributing Guide](./docs/contributing.md)
- [Testing Guide](./docs/testing.md)
- [Architecture](./docs/architecture.md)

## 🤝 Contributing

Contributions are welcome! See the [contributing guide](./docs/contributing.md).

## 📄 License

MIT - see [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

- [Obsidian Plugin API](https://github.com/obsidianmd/obsidian-api)
- [Obsidian Sample Plugin](https://github.com/obsidianmd/obsidian-sample-plugin)