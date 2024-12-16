export type TranslationKey = 
   // Dashboard
   | 'dashboard.title'
   | 'dashboard.description'
   | 'dashboard.viewMode'
   | 'dashboard.viewModeDesc'
   | 'dashboard.viewModeTab'
   | 'dashboard.viewModeSidebar'
   | 'dashboard.viewModePopup'
   | 'dashboard.noPlugins'
   | 'dashboard.installedPlugins'
   | 'dashboard.switchToList'
   | 'dashboard.switchToCards'
   | 'dashboard.listView'
   | 'dashboard.cardView'
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
   | 'settings.pluginFolder.name'
   | 'settings.pluginFolder.desc'
   | 'settings.pluginFolder.updated'
   | 'settings.template.name'
   | 'settings.template.desc'
   | 'settings.groupFolder.name'
   | 'settings.groupFolder.desc'
   | 'settings.groupFolder.updated'
   | 'settings.importExport.title'
   | 'settings.importExport.jsonImport.name'
   | 'settings.importExport.jsonImport.desc'
   | 'settings.importExport.jsonImport.button'
   | 'settings.importExport.jsonImport.loading'
   | 'settings.importExport.jsonImport.success'
   | 'settings.importExport.jsonImport.error'
   | 'settings.importExport.jsonExport.name'
   | 'settings.importExport.jsonExport.desc'
   | 'settings.importExport.jsonExport.button'
   | 'settings.importExport.jsonExport.loading'
   | 'settings.importExport.jsonExport.success'
   | 'settings.importExport.jsonExport.error'
   | 'settings.groups.title'
   | 'settings.groups.delete.button'
   | 'settings.groups.delete.success'
   | 'settings.groups.delete.error'
   | 'settings.groups.add.name'
   | 'settings.groups.add.desc'
   | 'settings.groups.add.placeholder'
   | 'settings.groups.add.success'
   | 'settings.groups.add.error'
   | 'settings.plugins.title'
   | 'settings.plugins.search.placeholder'
   | 'settings.plugins.options.status'
   | 'settings.plugins.status.exploring'
   | 'settings.plugins.status.active'
   | 'settings.plugins.status.inactive'
   | 'settings.plugins.options.groups'
   | 'settings.plugins.groups.none'
   | 'settings.plugins.groups.updated'
   | 'settings.plugins.groups.error'
   | 'settings.plugins.options.rating'
   | 'settings.plugins.options.urgency'
   | 'settings.plugins.options.importance'
   | 'settings.plugins.delete.button'
   | 'settings.plugins.delete.confirm'
   | 'settings.plugins.delete.confirmMessage'
   | 'settings.plugins.delete.cancel'
   | 'settings.plugins.deleted'
   | 'settings.plugins.activate.tooltip'
   | 'settings.plugins.deactivate.tooltip'
   | 'settings.plugins.toggle.tooltip'
   | 'settings.plugins.activated'
   | 'settings.plugins.deactivated'
   | 'settings.plugins.add.name'
   | 'settings.plugins.add.desc'
   | 'settings.plugins.add.placeholder'
   | 'settings.plugins.add.success'
   | 'settings.plugins.add.error'
   | 'settings.plugins.rating.tooltip'
   | 'settings.plugins.urgency.tooltip'
   | 'settings.plugins.importance.tooltip'

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
      'dashboard.noPlugins': 'No plugins installed yet. Install some plugins to manage them here.',
      'dashboard.installedPlugins': 'Installed Plugins',
      'dashboard.switchToList': 'Switch to list view',
      'dashboard.switchToCards': 'Switch to cards view',
      'dashboard.listView': 'List View',
      'dashboard.cardView': 'Card View',
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
      'settings.defaultViewModeDesc': 'Choose how the plugin dashboard will open by default',
      'settings.tab': 'Tab',
      'settings.sidebar': 'Sidebar',
      'settings.popup': 'Popup',
      'settings.pluginFolder.name': 'Plugin Notes Folder',
      'settings.pluginFolder.desc': 'Where to store plugin notes',
      'settings.pluginFolder.updated': 'Plugin folder updated',
      'settings.template.name': 'Note Template',
      'settings.template.desc': 'Template for plugin notes (use {{name}}, {{description}}, {{url}})',
      'settings.groupFolder.name': 'Group Folder',
      'settings.groupFolder.desc': 'Where to store plugin groups',
      'settings.groupFolder.updated': 'Group folder updated',
      // Import/Export
      'settings.importExport.title': 'Import/Export',
      'settings.importExport.jsonImport.name': 'Import Configuration',
      'settings.importExport.jsonImport.desc': 'Import plugin configuration from JSON file',
      'settings.importExport.jsonImport.button': 'Import JSON',
      'settings.importExport.jsonImport.loading': 'Importing configuration...',
      'settings.importExport.jsonImport.success': 'Configuration imported successfully',
      'settings.importExport.jsonImport.error': 'Error importing configuration',
      'settings.importExport.jsonExport.name': 'Export Configuration',
      'settings.importExport.jsonExport.desc': 'Export plugin configuration to JSON file',
      'settings.importExport.jsonExport.button': 'Export JSON',
      'settings.importExport.jsonExport.loading': 'Exporting configuration...',
      'settings.importExport.jsonExport.success': 'Configuration exported successfully',
      'settings.importExport.jsonExport.error': 'Error exporting configuration',
      // Groups Management
      'settings.groups.title': 'Groups Management',
      'settings.groups.delete.button': 'Delete',
      'settings.groups.delete.success': 'Group deleted',
      'settings.groups.delete.error': 'Error deleting group',
      'settings.groups.add.name': 'Add New Group',
      'settings.groups.add.desc': 'Create a new group for organizing plugins',
      'settings.groups.add.placeholder': 'Group name',
      'settings.groups.add.success': 'Group created',
      'settings.groups.add.error': 'Error creating group',
      // Plugins Management
      'settings.plugins.title': 'Plugins Management',
      'settings.plugins.search.placeholder': 'Search plugins...',
      'settings.plugins.options.status': 'Status',
      'settings.plugins.status.exploring': 'Exploring',
      'settings.plugins.status.active': 'Active',
      'settings.plugins.status.inactive': 'Inactive',
      'settings.plugins.options.groups': 'Groups',
      'settings.plugins.groups.none': 'No group',
      'settings.plugins.groups.updated': 'Plugin {title} groups updated from {from} to {to}',
      'settings.plugins.groups.error': 'Error updating groups',
      'settings.plugins.options.rating': 'Rating',
      'settings.plugins.options.urgency': 'Urgency',
      'settings.plugins.options.importance': 'Importance',
      'settings.plugins.delete.button': 'Delete Plugin',
      'settings.plugins.delete.confirm': 'Delete Plugin',
      'settings.plugins.delete.confirmMessage': 'Are you sure you want to delete {title}?',
      'settings.plugins.delete.cancel': 'Cancel',
      'settings.plugins.deleted': 'Plugin {title} deleted',
      // Plugin Actions & Tooltips
      'settings.plugins.activate.tooltip': 'Activate plugin',
      'settings.plugins.deactivate.tooltip': 'Deactivate plugin',
      'settings.plugins.toggle.tooltip': 'Show/Hide options',
      'settings.plugins.activated': 'Plugin {title} activated',
      'settings.plugins.deactivated': 'Plugin {title} deactivated',
      'settings.plugins.add.name': 'Add Plugin',
      'settings.plugins.add.desc': 'Add a new plugin to manage',
      'settings.plugins.add.placeholder': 'Plugin name',
      'settings.plugins.add.success': 'Plugin added successfully',
      'settings.plugins.add.error': 'Error adding plugin',
      'settings.plugins.rating.tooltip': 'Rate from 1 to 5',
      'settings.plugins.urgency.tooltip': 'Set urgency (1: Low, 2: Medium, 3: High)',
      'settings.plugins.importance.tooltip': 'Set importance (1: Low, 2: Medium, 3: High)',
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
      'dashboard.noPlugins': 'Aucun plugin installé pour le moment. Installez des plugins pour les gérer ici.',
      'dashboard.installedPlugins': 'Plugins Installés',
      'dashboard.switchToList': 'Passer en vue liste',
      'dashboard.switchToCards': 'Passer en vue cartes',
      'dashboard.listView': 'Vue Liste',
      'dashboard.cardView': 'Vue Cartes',
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
      'settings.defaultViewModeDesc': 'Choisissez comment le tableau de bord s\'ouvrira par défaut',
      'settings.tab': 'Onglet',
      'settings.sidebar': 'Barre latérale',
      'settings.popup': 'Fenêtre modale',
      'settings.pluginFolder.name': 'Dossier des notes de plugins',
      'settings.pluginFolder.desc': 'Où stocker les notes des plugins',
      'settings.pluginFolder.updated': 'Dossier des plugins mis à jour',
      'settings.template.name': 'Template des notes',
      'settings.template.desc': 'Template pour les notes de plugins (utilise {{name}}, {{description}}, {{url}})',
      'settings.groupFolder.name': 'Dossier des groupes',
      'settings.groupFolder.desc': 'Où stocker les groupes de plugins',
      'settings.groupFolder.updated': 'Dossier des groupes mis à jour',
      // Import/Export
      'settings.importExport.title': 'Import/Export',
      'settings.importExport.jsonImport.name': 'Importer la configuration',
      'settings.importExport.jsonImport.desc': 'Importer la configuration depuis un fichier JSON',
      'settings.importExport.jsonImport.button': 'Importer JSON',
      'settings.importExport.jsonImport.loading': 'Importation en cours...',
      'settings.importExport.jsonImport.success': 'Configuration importée avec succès',
      'settings.importExport.jsonImport.error': 'Erreur lors de l\'importation',
      'settings.importExport.jsonExport.name': 'Exporter la configuration',
      'settings.importExport.jsonExport.desc': 'Exporter la configuration vers un fichier JSON',
      'settings.importExport.jsonExport.button': 'Exporter JSON',
      'settings.importExport.jsonExport.loading': 'Exportation en cours...',
      'settings.importExport.jsonExport.success': 'Configuration exportée avec succès',
      'settings.importExport.jsonExport.error': 'Erreur lors de l\'exportation',
      // Groups Management
      'settings.groups.title': 'Gestion des groupes',
      'settings.groups.delete.button': 'Supprimer',
      'settings.groups.delete.success': 'Groupe supprimé',
      'settings.groups.delete.error': 'Erreur lors de la suppression',
      'settings.groups.add.name': 'Ajouter un groupe',
      'settings.groups.add.desc': 'Créer un nouveau groupe pour organiser les plugins',
      'settings.groups.add.placeholder': 'Nom du groupe',
      'settings.groups.add.success': 'Groupe créé',
      'settings.groups.add.error': 'Erreur lors de la création',
      // Plugins Management
      'settings.plugins.title': 'Gestion des plugins',
      'settings.plugins.search.placeholder': 'Rechercher des plugins...',
      'settings.plugins.options.status': 'Statut',
      'settings.plugins.status.exploring': 'En exploration',
      'settings.plugins.status.active': 'Actif',
      'settings.plugins.status.inactive': 'Inactif',
      'settings.plugins.options.groups': 'Groupes',
      'settings.plugins.groups.none': 'Sans groupe',
      'settings.plugins.groups.updated': 'Groupes du plugin {title} mis à jour de {from} vers {to}',
      'settings.plugins.groups.error': 'Erreur lors de la mise à jour des groupes',
      'settings.plugins.options.rating': 'Note',
      'settings.plugins.options.urgency': 'Urgence',
      'settings.plugins.options.importance': 'Importance',
      'settings.plugins.delete.button': 'Supprimer le plugin',
      'settings.plugins.delete.confirm': 'Supprimer le plugin',
      'settings.plugins.delete.confirmMessage': 'Êtes-vous sûr de vouloir supprimer {title} ?',
      'settings.plugins.delete.cancel': 'Annuler',
      'settings.plugins.deleted': 'Plugin {title} supprimé',
      // Plugin Actions & Tooltips
      'settings.plugins.activate.tooltip': 'Activer le plugin',
      'settings.plugins.deactivate.tooltip': 'Désactiver le plugin',
      'settings.plugins.toggle.tooltip': 'Afficher/Masquer les options',
      'settings.plugins.activated': 'Plugin {title} activé',
      'settings.plugins.deactivated': 'Plugin {title} désactivé',
      'settings.plugins.add.name': 'Ajouter un plugin',
      'settings.plugins.add.desc': 'Ajouter un nouveau plugin à gérer',
      'settings.plugins.add.placeholder': 'Nom du plugin',
      'settings.plugins.add.success': 'Plugin ajouté avec succès',
      'settings.plugins.add.error': 'Erreur lors de l\'ajout du plugin',
      'settings.plugins.rating.tooltip': 'Noter de 1 à 5',
      'settings.plugins.urgency.tooltip': 'Définir l\'urgence (1: Faible, 2: Moyenne, 3: Haute)',
      'settings.plugins.importance.tooltip': 'Définir l\'importance (1: Faible, 2: Moyenne, 3: Haute)',
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
