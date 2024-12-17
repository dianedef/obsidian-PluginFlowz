import { Plugin, Notice } from 'obsidian';
import { Settings } from './Settings';
import { Translations } from './Translations';
import { ViewMode } from './ViewMode';

export class Hotkeys {
   constructor(
      private plugin: Plugin,
      private settings: Settings,
      private translations: Translations,
      private viewMode: ViewMode
   ) {}
   registerHotkeys() {
      // Ouvrir le dashboard
      this.plugin.addCommand({
         id: 'open-plugins-dashboard',
         name: this.translations.t('commands.openDashboard'),
         icon: 'layout-grid',
         callback: async () => {
            try {
               const mode = await Settings.getViewMode();
               await this.viewMode.setView(mode);
            } catch (error) {
               console.error('[Hotkeys]', error);
               new Notice(this.translations.t('errors.openDashboard'));
            }
         },
         hotkeys: [{ modifiers: ['Alt'], key: 'P' }]
      });

      // Activer le groupe Tech
      this.plugin.addCommand({
         id: 'activate-tech-group',
         name: this.translations.t('commands.activateTechGroup'),
         icon: 'cogs',
         callback: async () => {
            try {
               await this.viewMode.activateGroup('Tech');
            } catch (error) {
               console.error('[Hotkeys]', error);
               new Notice(this.translations.t('errors.activateTechGroup'));
            }
         },
         hotkeys: [{ modifiers: ['Alt'], key: 'T' }]
      });

      // Activer le groupe Outils
      this.plugin.addCommand({
         id: 'activate-outils-group',
         name: this.translations.t('commands.activateOutilsGroup'),
         icon: 'tools',
         callback: async () => {
            try {
               await this.viewMode.activateGroup('Outils');
            } catch (error) {
               console.error('[Hotkeys]', error);
               new Notice(this.translations.t('errors.activateOutilsGroup'));
            }
         },
         hotkeys: [{ modifiers: ['Alt'], key: 'O' }]
      });

      // Activer le groupe Base
      this.plugin.addCommand({
         id: 'activate-base-group',
         name: this.translations.t('commands.activateBaseGroup'),
         icon: 'home',
         callback: async () => {
            try {
               await this.viewMode.activateGroup('Base');
            } catch (error) {
               console.error('[Hotkeys]', error);
               new Notice(this.translations.t('errors.activateBaseGroup'));
            }
         },
         hotkeys: [{ modifiers: ['Alt'], key: 'B' }]
      });
   }
}
