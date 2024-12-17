import { Plugin, Menu, Component } from 'obsidian';
import { TViewMode } from './types';
import { registerStyles } from './RegisterStyles';
import { Settings, SettingsTab, DEFAULT_SETTINGS } from './Settings';
import { Translations } from './Translations';
import { Hotkeys } from './Hotkeys';
import { DashboardView } from './Dashboard';
import { ViewMode } from './ViewMode';

export default class PluginFlowz extends Plugin {
   private viewMode!: ViewMode;
   settings!: Settings;
   private translations: Translations = new Translations();
   private hotkeys!: Hotkeys;
   private dashboard!: DashboardView;

   private initializeView() {
      this.registerView(
         "pluginflowz-view",
         (leaf) => {
            const view = new DashboardView(leaf, this);
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

      // Initialiser les settings
      await Settings.loadSettings();

      // Initialiser le gestionnaire de vue
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
            try {
               const mode = await Settings.getViewMode();
               await this.viewMode.setView(mode);
            } catch (error) {
               console.error('[PluginFlowz]', error);
               new Notice(this.translations.t('errors.openDashboard'));
            }
         }
      );

      // Menu hover
      this.registerDomEvent(ribbonIcon, 'mouseenter', () => {
         const menu = new Menu();

         const createMenuItem = (title: string, icon: string, mode: TViewMode) => {
            menu.addItem((item) => {
               item.setTitle(title)
                  .setIcon(icon)
                  .onClick(async () => {
                     try {
                        await this.viewMode.setView(mode);
                        await Settings.saveSettings({ currentMode: mode });
                     } catch (error) {
                        console.error('[PluginFlowz]', error);
                        new Notice(this.translations.t('errors.openDashboard'));
                     }
                  });
            });
         };

         createMenuItem("Dashboard Tab", "tab", "tab" as TViewMode);
         createMenuItem("Dashboard Sidebar", "layout-sidebar-right", "sidebar" as TViewMode);
         createMenuItem("Dashboard Popup", "layout-top", "popup" as TViewMode);

         const iconRect = ribbonIcon.getBoundingClientRect();
         menu.showAtPosition({ 
            x: iconRect.left, 
            y: iconRect.top - 10
         });

         // Fermer le menu quand la souris quitte l'icône
         this.registerDomEvent(ribbonIcon, 'mouseleave', (e: MouseEvent) => {
            const target = e.relatedTarget as HTMLElement;
            if (!target?.closest('.menu')) {
               menu.hide();
            }
         });
      });

      // Écouter les modifications de notes
      this.registerEvent(
         this.app.metadataCache.on('changed', async (file) => {
            const settings = await Settings.loadSettings();
            if (file.path.startsWith(settings.notesFolder)) {
               // Rafraîchir la vue
               if (this.dashboard) {
                  await this.dashboard.refresh();
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
