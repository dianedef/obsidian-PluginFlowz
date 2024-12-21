import { Plugin, Notice } from 'obsidian';
import { Settings } from './Settings';
import type { TPluginGroup } from './types';
import { useTranslations } from './composables/useTranslations';
import { useViewMode } from './composables/useViewMode';
import { usePluginManager } from './composables/usePluginManager';

type ViewMode = ReturnType<typeof useViewMode>;

export class Hotkeys {
   private translations = useTranslations();
   private pluginManager = usePluginManager();

   constructor(
      private plugin: Plugin,
      private settings: typeof Settings,
      private viewMode: ViewMode
   ) {
      if (!plugin) {
         throw new Error('[Hotkeys] Plugin non fourni');
      }
      if (!settings) {
         throw new Error('[Hotkeys] Settings non fourni');
      }
      if (!viewMode || !viewMode.setView) {
         throw new Error('[Hotkeys] ViewMode non initialisé correctement');
      }
   }

   registerHotkeys() {
      // Ouvrir le dashboard
      this.plugin.addCommand({
         id: 'open-plugins-dashboard',
         name: this.translations.t('commands.openDashboard'),
         icon: 'layout-grid',
         callback: async () => {
            try {
               // Utiliser le mode actuel ou 'popup' par défaut
               const settings = await this.settings.loadSettings();
               const mode = settings.currentMode || 'popup';
               await this.viewMode.setView(mode);
            } catch (error) {
               console.error('[Hotkeys]', error);
               new Notice(this.translations.t('errors.openDashboard'));
            }
         },
         hotkeys: [{ modifiers: ['Alt'], key: 'P' }]
      });

      // Activer les groupes
      const activateGroup = async (group: TPluginGroup, errorKey: string) => {
         try {
            const plugins = await this.pluginManager.getPluginsByGroup(group);
            for (const plugin of plugins) {
               if (!plugin.activate) {
                  await this.pluginManager.activatePlugin(plugin);
               }
            }
         } catch (error) {
            console.error('[Hotkeys]', error);
            new Notice(this.translations.t(errorKey));
         }
      };

      // Activer le groupe Tech
      this.plugin.addCommand({
         id: 'activate-tech-group',
         name: this.translations.t('commands.activateTechGroup'),
         icon: 'cogs',
         callback: () => activateGroup('Tech', 'errors.activateTechGroup'),
         hotkeys: [{ modifiers: ['Alt'], key: 'T' }]
      });

      // Activer le groupe Outils
      this.plugin.addCommand({
         id: 'activate-outils-group',
         name: this.translations.t('commands.activateOutilsGroup'),
         icon: 'tools',
         callback: () => activateGroup('Outils', 'errors.activateOutilsGroup'),
         hotkeys: [{ modifiers: ['Alt'], key: 'O' }]
      });

      // Activer le groupe Base
      this.plugin.addCommand({
         id: 'activate-base-group',
         name: this.translations.t('commands.activateBaseGroup'),
         icon: 'home',
         callback: () => activateGroup('Base', 'errors.activateBaseGroup'),
         hotkeys: [{ modifiers: ['Alt'], key: 'B' }]
      });
   }
}
