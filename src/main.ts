import { Plugin, Menu, Component } from 'obsidian';
import { TViewMode } from './types';
import { registerStyles } from './RegisterStyles';
import { Settings, SettingsTab, DEFAULT_SETTINGS } from './Settings'
import { Translations } from './Translations';
import { Hotkeys } from './Hotkeys';
import { Dashboard } from './Dashboard';
import { ViewMode } from './ViewMode';
import { PluginManager } from './PluginManager';

export default class PluginFlowz extends Plugin {
   private viewMode!: ViewMode;
   settings!: Settings;
   private translations: Translations = new Translations();
   private hotkeys!: Hotkeys;
   private dashboard!: Dashboard;

   private initializeView() {
      this.registerView(
         "pluginflowz-view",
         (leaf) => {
            const view = new Dashboard(leaf, this.settings, this.translations, this);
            this.dashboard = view;
            return view;
         }
      );
   }

   async onload() {
      await this.loadApp();

      // Initialisation
      Settings.initialize(this);
      console.log('🔌 PluginFlowz - Initialisation terminée', this.app);
      
      // Initialiser les traductions
      this.loadLanguage();

      // Initialiser ViewMode
      this.viewMode = new ViewMode(this);
      
      // Initialiser les hotkeys
      this.hotkeys = new Hotkeys(
         this,
         Settings,
         this.translations,
         this.viewMode
      );
      this.hotkeys.registerHotkeys();
      
      this.initializeView();

      // Ajouter l'onglet de paramètres
      this.addSettingTab(new SettingsTab(
         this.app,
         this,
         DEFAULT_SETTINGS,
         this.viewMode,
         this.translations
      ));

      // Création du menu
      const ribbonIcon = this.addRibbonIcon(
         'layout-grid',
         'PluginFlowz', 
         async () => {
            const mode = await Settings.getViewMode();
            await this.viewMode.setView(mode);
         }
      );

      // Menu hover
      ribbonIcon.addEventListener('mouseenter', (event: MouseEvent) => {
         const menu = new Menu(this.app);
         
         menu.addItem((item) => {
            item
               .setTitle(this.translations.t('settings.defaultViewMode.tab'))
               .setIcon('layout-template')
               .onClick(async () => {
                  await this.viewMode.setView('tab');
               });
         });

         menu.addItem((item) => {
            item
               .setTitle(this.translations.t('settings.defaultViewMode.sidebar'))
               .setIcon('layout-sidebar-right')
               .onClick(async () => {
                  await this.viewMode.setView('sidebar');
               });
         });

         menu.addItem((item) => {
            item
               .setTitle(this.translations.t('settings.defaultViewMode.popup'))
               .setIcon('layout-dashboard')
               .onClick(async () => {
                  await this.viewMode.setView('popup');
               });
         });

         const rect = (event.target as HTMLElement).getBoundingClientRect();
         menu.showAtPosition({ x: rect.right + 5, y: rect.top });
      });

      // Écouter les modifications de notes
      this.registerEvent(
         this.app.metadataCache.on('changed', async (file) => {
            const settings = await Settings.loadSettings();
            if (file.path.startsWith(settings.notesFolder)) {
               // Rafraîchir la vue
               if (this.viewMode) {
                  await this.viewMode.refresh();
               }
            }
         })
      );

      registerStyles();
   }

   private async loadApp(): Promise<void> {
      return new Promise((resolve) => {
         if (!this.app.workspace) {
            setTimeout(resolve, 0);
         } else {
            resolve();
         }
      });
   }

   private loadLanguage(): void {
      try {
         const locale = document.documentElement.lang?.toLowerCase().startsWith('fr') ? 'fr' : 'en';
         console.log('Langue détectée:', locale);
         this.translations.setLanguage(locale);
      } catch (error) {
         console.warn('Erreur lors de la détection de la langue, utilisation du français par défaut');
         this.translations.setLanguage('fr');
      }
   }

   onunload() {
      this.app.workspace.detachLeavesOfType("pluginflowz-view");
   }
}
