export type TranslationKey = 
   // Dashboard
   | 'dashboard.title'
   | 'dashboard.description'
   | 'dashboard.viewMode'
   | 'dashboard.viewModeDesc'
   | 'dashboard.viewModeTab'
   | 'dashboard.viewModeSidebar'
   | 'dashboard.viewModePopup'
   // Notices
   | 'notices.saved'
   | 'notices.error'
   | 'notices.success'
   | 'notices.featureEnabled'
   | 'notices.featureDisabled'
   // Commands
   | 'commands.openDashboard'
   // Errors
   // Settings
   | 'settings.defaultViewMode'
   | 'settings.defaultViewModeDesc'
   | 'settings.tab'
   | 'settings.sidebar'
   | 'settings.popup'

export const translations: { [lang: string]: Record<TranslationKey, string> } = {
   en: {
      // Dashboard
      'dashboard.title': 'PluginFlowz',
      'dashboard.description': 'PluginFlowz is a plugin for Obsidian that allows you to manage your videos.',
      'dashboard.viewMode': 'View Mode',
      'dashboard.viewModeDesc': 'Choose how videos will open by default',
      'dashboard.viewModeTab': 'Tab',
      'dashboard.viewModeSidebar': 'Sidebar',
      'dashboard.viewModePopup': 'Popup',
      // Notices
      'notices.saved': '✅ Settings saved',
      'notices.error': '❌ Error: {message}',
      'notices.success': '✅ Operation successful',
      'notices.featureEnabled': '✅ Feature enabled',
      'notices.featureDisabled': '❌ Feature disabled',
      // Commands
      'commands.openDashboard': 'Open Dashboard',
      // Errors
      // Settings
      'settings.defaultViewMode': 'Default View Mode',
      'settings.defaultViewModeDesc': 'Choose how videos will open by default',
      'settings.tab': 'Tab',
      'settings.sidebar': 'Sidebar',
      'settings.popup': 'Popup',
   },
   fr: {
      // Dashboard
      'dashboard.title': 'PluginFlowz',
      'dashboard.description': 'PluginFlowz est un plugin pour Obsidian qui vous permet de gérer vos vidéos.',
      'dashboard.viewMode': 'Mode d\'affichage',
      'dashboard.viewModeDesc': 'Choisissez comment les vidéos s\'ouvriront par défaut',
      'dashboard.viewModeTab': 'Onglet',
      'dashboard.viewModeSidebar': 'Barre latérale',
      'dashboard.viewModePopup': 'Fenêtre contextuelle',
      // Notices
      'notices.saved': '✅ Paramètres sauvegardés',
      'notices.error': '❌ Erreur: {message}',
      'notices.success': '✅ Opération réussie',
      'notices.featureEnabled': '✅ Fonctionnalité activée',
      'notices.featureDisabled': '❌ Fonctionnalité désactivée',
      // Commands
      'commands.openDashboard': 'Ouvrir le tableau de bord',
      // Errors
      // Settings
      'settings.defaultViewMode': 'Mode d\'affichage par défaut',
      'settings.defaultViewModeDesc': 'Choisissez comment les vidéos s\'ouvriront par défaut',
      'settings.tab': 'Onglet',
      'settings.sidebar': 'Barre latérale',
      'settings.popup': 'Fenêtre contextuelle',
   }
};

export class Translations {
   private currentLang: string;

   constructor(initialLang: string = 'fr') {
      this.currentLang = initialLang;
   }

   setLanguage(lang: string): void {
      this.currentLang = lang;
   }

   t(key: TranslationKey): string {
      return translations[this.currentLang]?.[key] || translations['en'][key] || key;
   }
}
