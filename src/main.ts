import { Plugin, Menu } from 'obsidian';
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
      
      // Initialiser les traductions
      this.loadLanguage();

      // Initialiser ViewMode avant de l'utiliser
      this.viewMode = new ViewMode(this, this.app);
      
      // Initialiser les hotkeys
      this.hotkeys = new Hotkeys(
         this,
         Settings,
         this.translations,
         this.viewMode
      );
      this.hotkeys.registerHotkeys();
      
      this.initializeView();

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

      ribbonIcon.addEventListener('mouseenter', () => {
         const menu = new Menu();

         const createMenuItem = (title: string, icon: string, mode: TViewMode) => {
            menu.addItem((item) => {
               item.setTitle(title)
                  .setIcon(icon)
                  .onClick(async () => {
                     await this.viewMode.setView(mode);
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

         const handleMouseLeave = (e: MouseEvent) => {
            const target = e.relatedTarget as Node;
            const menuDom = (menu as any).dom;
            const isOverIcon = ribbonIcon.contains(target);
            const isOverMenu = menuDom && menuDom.contains(target);
            
            if (!isOverIcon && !isOverMenu) {
               menu.hide();
               ribbonIcon.removeEventListener('mouseleave', handleMouseLeave);
               if (menuDom) {
                  menuDom.removeEventListener('mouseleave', handleMouseLeave);
               }
            }
         };

         ribbonIcon.addEventListener('mouseleave', handleMouseLeave);
         const menuDom = (menu as any).dom;
         if (menuDom) {
            menuDom.addEventListener('mouseleave', handleMouseLeave);
         }
      });

      registerStyles();

      // Synchroniser les plugins au démarrage
      const pluginManager = new PluginManager(this);
      await pluginManager.syncPlugins();
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
