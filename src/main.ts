import { Plugin, Menu, Notice, WorkspaceLeaf, TFile } from 'obsidian';
import { TViewMode } from './types';
import { registerStyles } from './RegisterStyles';
import { Settings, SettingsTab, DEFAULT_SETTINGS } from './Settings';
import { useTranslations } from './composables/useTranslations';
import { Hotkeys } from './Hotkeys';
import { DashboardView } from './Dashboard';
import { useViewMode } from './composables/useViewMode';
import { createApp } from 'vue';

export default class PluginFlowz extends Plugin {
   settings!: Settings;
   private translations = useTranslations();
   private hotkeys!: Hotkeys;
   private dashboard!: DashboardView;
   private vueApp: ReturnType<typeof createApp> | null = null;
   private viewMode = useViewMode();

   private initializeView() {
      this.registerView(
         "pluginflowz-view",
         (leaf: WorkspaceLeaf) => {
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
      console.log('🔥 Hot reload test - ' + new Date().toLocaleTimeString());

      // Initialiser les traductions
      this.loadLanguage();

      // Initialiser les settings
      await Settings.loadSettings();

      // Initialiser le gestionnaire de vue
      const viewMode = useViewMode();
      await viewMode.initializeViewMode(this);

      // Initialiser les hotkeys
      this.hotkeys = new Hotkeys(
         this,
         Settings,
         viewMode
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
      const ribbonIconEl = this.addRibbonIcon(
         'layout-grid',
         this.translations.t('dashboard.title'), 
         async () => {
            try {
               const mode = await Settings.getViewMode();
               await this.viewMode.setView(mode);
            } catch (error) {
               console.error('[PluginFlowz]', error);
               new Notice(this.translations.t('notices.error'));
            }
         }
      );

      // Menu hover
      this.registerDomEvent(ribbonIconEl, 'mouseenter', () => {
         const menu = new Menu();

         const createMenuItem = (title: string, icon: string, mode: TViewMode) => {
            menu.addItem((item) => {
               item.setTitle(title)
                  .setIcon(icon)
                  .onClick(async () => {
                     try {
                        await this.viewMode.setView(mode);
                        await Settings.saveSettings({ currentMode: mode });
                        new Notice(this.translations.t('notices.success'));
                     } catch (error) {
                        console.error('[PluginFlowz]', error);
                        new Notice(this.translations.t('notices.error'));
                     }
                  });
            });
         };

         createMenuItem(this.translations.t('dashboard.viewModeTab'), "tab", "tab");
         createMenuItem(this.translations.t('dashboard.viewModeSidebar'), "layout-sidebar-right", "sidebar");
         createMenuItem(this.translations.t('dashboard.viewModePopup'), "layout-top", "popup");

         const rect = ribbonIconEl.getBoundingClientRect();
         menu.showAtPosition({ 
            x: rect.left, 
            y: rect.top - 10
         });

         // Fermer le menu quand la souris quitte l'icône
         this.registerDomEvent(ribbonIconEl, 'mouseleave', (e: MouseEvent) => {
            const target = e.relatedTarget as HTMLElement;
            if (!target?.closest('.menu')) {
               menu.hide();
            }
         });
      });

      // Écouter les modifications manuelles des notes
      this.registerEvent(
         this.app.vault.on('modify', async (file: TFile) => {
            try {
               const settings = await Settings.loadSettings();
               if (file.path.startsWith(settings.notesFolder)) {
                  // Rafraîchir la vue
                  if (this.dashboard) {
                     await this.dashboard.refresh();
                  }
               }
            } catch (error) {
               console.error('[PluginFlowz] Erreur lors du rafraîchissement:', error);
            }
         })
      );

      registerStyles();
   }

   private async loadApp(): Promise<void> {
      return new Promise((resolve) => {
         if (!this.app.workspace) {
            setTimeout(() => this.loadApp().then(resolve), 100);
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
      // Nettoyer l'application Vue
      if (this.vueApp) {
         this.vueApp.unmount();
         this.vueApp = null;
      }

      // Détacher les vues
      this.app.workspace.detachLeavesOfType("pluginflowz-view");
   }
}
